'use strict'

module.exports = server => {
    // Tournaments list
    server.route({
        method : 'get',
        path   : '/tournaments',
        handler: (request, reply) => {
            if (!request.session.get('auth')) {
                return reply.redirect('/')
            }

            let tournaments = server.reloadDB().db('tournaments')
                .toJSON()
                .map((tournament, i) => {
                    tournament.id   = i
                    tournament.full = tournament.players === tournament.registered

                    return tournament
                })

            server.render(reply, 'tournaments', {
                admin: request.session.get('admin'),
                login: request.session.get('login'),
                tournaments
            })
        }
    })

    // Edit score
    server.route({
        method : 'post',
        path   : '/editTournament',
        handler: (request, reply) => {
            if (!request.session.get('auth')) {
                return reply.redirect('/')
            }

            let p = request.payload

            if (!p.tournamentId || !p.gameIndex || !p.roundIndex || typeof p.newScore === 'undefined' ||
                typeof p.isTop === 'undefined') {
                return reply(false)
            }

            let tournament = server.reloadDB().db('tournaments').toJSON()[p.tournamentId]
            let isOwner    = tournament.organizer === request.session.get('login')

            if (!tournament || (!request.session.get('admin') && !isOwner)) {
                return reply(false)
            }

            let game = tournament
                .tree
                [p.roundIndex]
                [p.gameIndex]

            let willBeTeam1 = p.gameIndex % 2 === 0
            console.log('GMAE INDEX ', willBeTeam1);

            if (p.isTop === 'true') {
                game.score1 = parseInt(p.newScore, 10)
            } else {
                game.score2 = parseInt(p.newScore, 10)
            }

            // Create nexts rounds
            tournament.tree.forEach((round, roundNumber) => {
                if (round.length === 1) {
                    console.log('pass round', round)
                    return
                }

                if (tournament.tree[roundNumber + 1]) {
                    // Already another round, update only the concerned game
                    let otherIndex = Math.floor(p.gameIndex / 2);
                    let nextGame  = tournament.tree[roundNumber + 1][otherIndex]
                    if (game.score1 > game.score2) {
                        console.log('other game', nextGame);
                        console.log('game', game);
                        if (willBeTeam1) {
                            nextGame.team1 = game.team1
                        } else {
                            nextGame.team2 = game.team1
                        }
                    } else if (game.score2 > game.score1) {
                        if (willBeTeam1) {
                            nextGame.team1 = game.team2
                        } else {
                            nextGame.team2 = game.team2
                        }
                    }
                    return
                }

                let newRound = []

                for (var i = 0; i < round.length; i += 2) {
                    let newGame = {
                        score1: 0,
                        score2: 0
                    }

                    if (round[i].score1 > round[i].score2) {
                        newGame.team1 = round[i].team1
                    } else if (round[i].score2 > round[i].score1) {
                        newGame.team1 = round[i].team2
                    }

                    if (!round[i + 1]) {
                        break
                    }

                    if (round[i + 1].score1 > round[i + 1].score2) {
                        newGame.team2 = round[i + 1].team1
                    } else if (round[i + 1].score2 > round[i + 1].score1) {
                        newGame.team2 = round[i + 1].team2
                    }

                    newRound.push(newGame)
                }

                tournament.tree.push(newRound)
            });

            server.db.save()

            return reply(true)
        }
    })

    // Tournament view
    server.route({
        method : 'get',
        path   : '/tournaments/{id}',
        handler: (request, reply) => {
            if (!request.session.get('auth')) {
                return reply.redirect('/')
            }

            let tournaments = server.reloadDB().db('tournaments').toJSON()

            if (tournaments.length <= request.params.id) {
                return reply.redirect('/tournaments')
            }

            let tree = tournaments[request.params.id].tree
                .map(round => round.map(game => {
                    game.team1 = (game.team1 === null) ? '(vide)': game.team1
                    game.team2 = (game.team2 === null) ? '(vide)': game.team2

                    return game
                }))

            server.render(reply, 'tournament', {
                admin     : request.session.get('admin'),
                login     : request.session.get('login'),
                tournament: tournaments[request.params.id],
                tree      : JSON.stringify(tree),
                isOwner   : tournaments[request.params.id].organizer === request.session.get('login')
            })
        }
    })

    // Tournament creation
    server.route({
        method : 'get',
        path   : '/createTournament',
        handler: (request, reply) => {
            if (!request.session.get('auth')) {
                return reply.redirect('/')
            }

            server.render(reply, 'createTournament', {
                admin: request.session.get('admin'),
                login: request.session.get('login')
            })
        }
    })

    server.route({
        method : 'post',
        path   : '/createTournament',
        handler: (request, reply) => {
            if (!request.session.get('auth')) {
                return reply.redirect('/')
            }

            let tournaments = server.reloadDB().db('tournaments').toJSON()

            console.log(request.payload)

            tournaments.push({
                "name"      : request.payload.name,
                "game"      : request.payload.game,
                "organizer" : request.session.get('login'),
                "position"  : request.payload.position,
                "players"   : parseInt(request.payload.players, 10),
                "registered": 1,
                "id"        : tournaments.length,
                "tree"      : [
                    [
                        {
                            team1 : request.payload.yourteam,
                            team2 : null,
                            score1: 0,
                            score2: 0
                        }
                    ]
                ]
            })

            let id = tournaments.length - 1

            server.db.save()
            reply.redirect(`tournaments/${id}`)
        }
    })

    // Tournament join
    server.route({
        method : 'post',
        path   : '/joinTournament/{id}',
        handler: (request, reply) => {
            if (!request.session.get('auth')) {
                return reply.redirect('/')
            }

            let id   = request.params.id
            let nick = request.payload.nick

            let tournaments = server.reloadDB().db('tournaments').toJSON()
            let tournament = null

            if (tournaments.length > id && nick) {
                tournament = tournaments[id]
            } else {
                return reply(false)
            }

            if (tournament.registered === tournament.players) {
                return reply('full')
            }

            ++tournament.registered

            let lastFight = tournament.tree[0][tournament.tree[0].length - 1]

            if (lastFight.team2 === null) {
                lastFight.team2 = nick
            } else {
                tournament.tree[0].push({
                    team1 : nick,
                    team2 : null,
                    score1: 0,
                    score2: 0
                })
            }

            server.db.save()

            reply(id)
        }
    })
}
