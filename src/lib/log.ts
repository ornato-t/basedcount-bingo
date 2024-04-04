interface LogCheck {
    discord_id: string,
    time: Date,
    type: 'check',
    text: string,
    url: string,
    name: string,
    image: string,
    self: boolean,
    box_id: number,
}
interface LogBingo {
    discord_id: string,
    time: Date,
    type: 'bingo',
    text: '',
    url: '',
    name: string,
    image: string,
    self: boolean
    box_id: -1,
}

export type Log = LogCheck | LogBingo;