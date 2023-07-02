import Caret from "../../utils/caret.js";
import EditingArea from "./editing-area.js";

let MQ: MQ.MQ = MathQuill.getInterface(2);

class MathBox {
    private static mathBoxes: Map<string, MathBox> = new Map();
    private static mathBoxCount: number = 0;

    private readonly fieldIndex: number;
    private readonly id: string;
    private readonly HTMLEl: HTMLElement;
    private readonly MQObj: MQ.MathField;

    constructor() {
        ++MathBox.mathBoxCount;

        this.fieldIndex = MathBox.mathBoxCount;
        this.id = `field${this.fieldIndex}`;
        this.HTMLEl = document.createElement("span");
        this.HTMLEl.setAttribute("id", this.id);
        this.HTMLEl.setAttribute("contenteditable", "false");

        EditingArea.addNodeToCaretPos(this.HTMLEl);

        this.MQObj = MQ.MathField(this.HTMLEl, {
            handlers: {
                moveOutOf: (direction: number, _: MQ.MathField): void => {
                    setTimeout((): void => {
                            if (direction === MQ.R) {
                                Caret.setAfter(this.HTMLEl);
                            } else if (direction === MQ.L) {
                                Caret.setBefore(this.HTMLEl);
                            }
                        }, 0);
                },
                deleteOutOf: (direction: number, _: MQ.MathField): void => {
                    Caret.setBefore(this.getHTMLEl());
                    this.destroy();
                },
                upOutOf: (_: MQ.MathField): void => {
                    let previousLine: Node[] = Caret.getPreviousLine();
                    if (previousLine && previousLine.length > 0) {
                        Caret.setAtClosestNodeOn(previousLine);
                    }
                },
                downOutOf: (_: MQ.MathField): void => {
                    let nextLine: Node[] = Caret.getNextLine();
                    if (nextLine && nextLine.length > 0) {
                        Caret.setAtClosestNodeOn(nextLine);
                    }
                }
            }
        });
        this.focus();

        MathBox.mathBoxes.set(this.id, this);
    }

    private destroy(): void {
        this.HTMLEl.remove();
        MathBox.mathBoxes.delete(this.id);
    }

    public focus(caretPos?: number): void {
        if (caretPos) {
            this.MQObj.moveToDirEnd(caretPos);
        }
        this.MQObj.focus();
    }

    public getHTMLEl(): HTMLElement {
        return this.HTMLEl;
    }

    public getContentEls(): NodeListOf<HTMLElement> {
        return this.HTMLEl.childNodes[1].childNodes as NodeListOf<HTMLElement>;
    }

    public getMQObj(): MQ.MathField {
        return this.MQObj;
    }

    public static getMathBox(id: string): MathBox {
        return this.mathBoxes.get(id);
    }

    public static getMathBoxes(): MathBox[] {
        return Array.from(MathBox.mathBoxes.values());
    }

    public static isMathBoxOrItsChild(node: Node): node is HTMLElement {
        return node instanceof HTMLElement
            && Array.from(MathBox.mathBoxes.values()).some(mathBox => mathBox.HTMLEl.contains(node));
    }

    public static isAnyMathBoxFocused(): boolean {
        return MathBox.isMathBoxOrItsChild(document.activeElement.parentNode);
    }

    public static getMathBoxesBeforeBRs(): MathBox[] {
        let mathBoxesBeforeBRs: MathBox[] = [];

        for (let mathBox of MathBox.getMathBoxes()) {
            if (mathBox.HTMLEl.previousSibling && mathBox.HTMLEl.previousSibling.nodeName === "BR") {
                mathBoxesBeforeBRs.push(mathBox);
            }
        }

        return mathBoxesBeforeBRs;
    }

    public static removeMathBoxesNotInDOM(): void {
        for (let mathBox of MathBox.mathBoxes.values()) {
            if (!mathBox.HTMLEl.isConnected) {
                mathBox.destroy();
            }
        }
    }
}

export default MathBox;
