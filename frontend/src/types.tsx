export type Player = {
        id: string,
        name: string
    }

export type Match = {
    id: string,
    p1: Player,
    p2: Player,
    p1wins: number,
    p2wins: number
}
