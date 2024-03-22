type Colour = "black" | "red" | "green" | "yellow" | "blue" | "magenta" | "cyan" | "white"

class Logger {
    private colours = {
        reset: "\x1b[0m",
        black: "\x1b[30m",
        red: "\x1b[31m",
        green: "\x1b[32m",
        yellow: "\x1b[33m",
        blue: "\x1b[34m",
        magenta: "\x1b[35m",
        cyan: "\x1b[36m",
        white: "\x1b[37m",
    }

    private errorColour
    private warnColour
    private successColour
    private infoColour

    constructor(errorColour, warnColour, successColour, infoColour) {
        this.errorColour = errorColour
        this.warnColour = warnColour
        this.successColour = successColour
        this.infoColour = infoColour
    }

    warn(str: string) {
        console.log(`${this.colours[this.warnColour]}[WARNING]${this.colours.reset} ` + str)
    }

    error(str: string) {
        console.log(`${this.colours[this.errorColour]}[WARNING]${this.colours.reset} ` + str)
    }

    success(str: string) {
        console.log(`${this.colours[this.successColour]}[WARNING]${this.colours.reset} ` + str)
    }

    info(str: string) {
        console.log(`${this.colours[this.infoColour]}[WARNING]${this.colours.reset} ` + str)
    }
}

export default new Logger("red", "yellow", "green", "blue")