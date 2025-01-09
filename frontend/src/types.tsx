export type Player = {
    id: string,
    name: string
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
    p2wins: number
}

export type Rounds = {
    currentRound: number,
    maxRound: number
}

export type Leaderboard = Array<PlayerStats>;

export type SubscribedData = {
    rounds: Rounds | null,
    matches: Array<Match> | null,
    leaderboard: Leaderboard | null,
    status: string | null
}