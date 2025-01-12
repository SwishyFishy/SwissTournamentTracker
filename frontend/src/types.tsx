export type Player = {
    id: string,
    name: string
    dropped: boolean;
}

export type PlayerStats = Player & {
    points: number,
    wins: number,
    losses: number,
    draws: number,
    omw: number,
    gw: number,
    ogw: number
}

export type Match = {
    p1: string,
    p2: string,
    p1wins: number,
    p2wins: number,
    reported: boolean
}

export type Rounds = {
    currentRound: number,
    maxRound: number
}

export type Leaderboard = Array<PlayerStats>;

export type SubscribedData = {
    rounds: Rounds | undefined,
    matches: Array<Match> | undefined,
    players: Array<Player> | undefined,
    leaderboard: Leaderboard | undefined,
    status: string | undefined
}