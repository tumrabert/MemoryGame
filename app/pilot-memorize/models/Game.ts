export interface GameSettings {
    memorizeTime: string; // Format: "mm:ss"
    answerTime: string; // Format: "mm:ss"
}

export interface ImagePosition {
    id: number;
    imgSrc: string;
    position?: number; // Add this property to track where the image was placed
}

export interface GameScore {
    correctPlaces: number;
    wrongPlaces: number;
    accuracy: number;
}

export enum GameStage {
    START = "start",
    MEMORIZE = "memorize",
    ANSWER = "answer",
    SUMMARY = "summary",
}

export class Game {
    private settings: GameSettings;
    private originalGrid: ImagePosition[] = [];
    private playerAnswers: ImagePosition[] = [];
    private currentStage: GameStage = GameStage.START;
    private score: GameScore = { correctPlaces: 0, wrongPlaces: 0, accuracy: 0 };

    constructor() {
        this.settings = {
            memorizeTime: "02:00", // Default 2 minutes
            answerTime: "02:00", // Default 2 minutes
        };
    }

    public updateSettings(settings: GameSettings): void {
        this.settings = settings;
    }

    public getSettings(): GameSettings {
        return this.settings;
    }

    public startGame(): void {
        this.currentStage = GameStage.MEMORIZE;
        this.originalGrid = this.generateShuffledImages();
        this.playerAnswers = Array(16).fill(null);
    }

    public moveToAnswerStage(): void {
        this.currentStage = GameStage.ANSWER;
    }

    public submitAnswers(answers: ImagePosition[]): void {
        // Initialize an array of 16 nulls
        this.playerAnswers = Array(16).fill(null);

        // Place each answer at its position
        answers.forEach(answer => {
            const position = answer.position !== undefined ? answer.position : -1;
            if (position >= 0 && position < 16) {
                this.playerAnswers[position] = answer;
            }
        });

        this.calculateScore();
        this.currentStage = GameStage.SUMMARY;
    }

    public getCurrentStage(): GameStage {
        return this.currentStage;
    }

    public getOriginalGrid(): ImagePosition[] {
        return this.originalGrid;
    }

    public getPlayerAnswers(): ImagePosition[] {
        return this.playerAnswers;
    }

    public getScore(): GameScore {
        return this.score;
    }

    public resetGame(): void {
        this.currentStage = GameStage.START;
        this.originalGrid = [];
        this.playerAnswers = [];
        this.score = { correctPlaces: 0, wrongPlaces: 0, accuracy: 0 };
    }

    private generateShuffledImages(): ImagePosition[] {
        // Create array of 16 images
        const images: ImagePosition[] = [];

        for (let i = 1; i <= 16; i++) {
            const imgNum = i < 10 ? `0${i}` : `${i}`;
            images.push({
                id: i,
                imgSrc: `/Image/img${imgNum}.png`,
            });
        }

        // Shuffle images using Fisher-Yates algorithm
        for (let i = images.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [images[i], images[j]] = [images[j], images[i]];
        }

        return images;
    }

    private calculateScore(): void {
        let correctPlaces = 0;
        let totalAnswered = 0;

        // Count correct placements and total answered positions
        for (let i = 0; i < 16; i++) {
            const playerAnswer = this.playerAnswers[i];
            if (playerAnswer) {
                totalAnswered++;
                if (i < this.originalGrid.length && playerAnswer.id === this.originalGrid[i].id) {
                    correctPlaces++;
                }
            }
        }

        const wrongPlaces = totalAnswered - correctPlaces;
        const accuracy = totalAnswered > 0 ? correctPlaces / totalAnswered : 0;

        this.score = {
            correctPlaces,
            wrongPlaces,
            accuracy
        };
    }
}
