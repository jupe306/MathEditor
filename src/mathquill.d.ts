declare let MathQuill: MQ.MathQuill;

declare namespace MQ {
    export interface MathQuill {
        getInterface(version: number): MQ;
    }

    export interface MQ {
        L: number;
        R: number;
        config(global_config: Config): void;
        StaticMath(html_element: HTMLElement, config?: Config): StaticMath;
        MathField(html_element: HTMLElement, config?: Config): MathField;
    }

    export interface StaticMath {
        revert(): StaticMath;
        reflow(): StaticMath;
        el(): HTMLElement;
        latex(): string;
        latex(latex_string: string): void;
    }

    export interface MathField extends StaticMath {
        revert(): MathField;
        reflow(): MathField;
        focus(): MathField;
        blur(): MathField;
        write(latex_string: string): MathField;
        cmd(latex_string: string): MathField;
        select(): MathField;
        clearSelection(): MathField;
        moveToLeftEnd(): MathField;
        moveToRightEnd(): MathField;
        moveToDirEnd(direction)
        keystroke(keys: string): MathField;
        typedText(text: string): MathField;
        config(new_config: Config): MathField;
        // registerEmbed(name: string, func: (id: number) => { htmlString: string, text: () => string, latex: () => string }): void;
    }

    export interface Config {
        spaceBehavesLikeTab?: boolean | undefined;
        leftRightIntoCmdGoes?: string | undefined;
        restrictMismatchedBrackets?: boolean | undefined;
        sumStartsWithNEquals?: boolean | undefined;
        supSubsRequireOperand?: boolean | undefined;
        charsThatBreakOutOfSupSub?: string | undefined;
        autoSubscriptNumerals?: boolean | undefined;
        autoCommands?: string | undefined;
        autoOperatorNames?: string | undefined;
        maxDepth?: number | undefined;
        substituteTextarea?(): HTMLTextAreaElement;
        handlers?: {
            enter?(mathField: MathField): any;
            edit?(mathField: MathField): any;
            upOutOf?(mathField: MathField): any;
            downOutOf?(mathField: MathField): any;
            moveOutOf?(direction: number, mathField: MathField): any;
            deleteOutOf?(direction: number, mathField: MathField): any;
        } | undefined;
    }
}
