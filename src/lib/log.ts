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

interface ContestationVote {
    voter_discord_id: string,
    voter_name: string,
    voter_image: string,
    vote: boolean,
}
export interface LogContestation {
    discord_id: string,
    time: Date,
    type: 'contestation',
    text: '',
    url: '',
    name: string,
    image: string,
    self: boolean
    box_id: number,
    reason: string,
    box_checker_discord_id: string,
    box_checker_name: string,
    box_checker_image: string,
    votes: ContestationVote[],
}

export type Log = LogCheck | LogBingo | LogContestation;