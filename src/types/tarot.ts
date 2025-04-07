export interface TarotCard {
    id: number;
    name: string;
    image: string;
    meaning?: string;
    reversed?: boolean;
}

export interface TarotReading {
    cards: TarotCard[];
    date: Date;
    question?: string;
}
