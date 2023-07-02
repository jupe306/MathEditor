import MathBox from "./math-box.js";
import EditingArea from "./editing-area.js";
import Caret from "../../utils/caret.js";

class CaretPlaceholder {
    private readonly HTMLEl: HTMLElement;

    private static readonly caretPlaceholders: CaretPlaceholder[] = [];

    constructor() {
        CaretPlaceholder.caretPlaceholders.push(this);

        this.HTMLEl = document.createElement("span");
        this.HTMLEl.className = "caret-placeholder";
        this.HTMLEl.setAttribute("contenteditable", "true");
    }

    public getHTMLEl(): HTMLElement {
        return this.HTMLEl;
    }

    private destroy(): void {
        let children: Node[] = this.getChildNodes();
        let isCaretInside: boolean = Caret.isInsideNode(this.HTMLEl);

        this.HTMLEl.replaceWith(...children);
        if (isCaretInside && children.length > 0) {
            if (MathBox.isMathBoxOrItsChild(children[0])) {
                MathBox.getMathBox(children[0].id).focus();
            } else {
                Caret.setAfter(children[0]);
            }
        }

        CaretPlaceholder.caretPlaceholders.splice(CaretPlaceholder.caretPlaceholders.indexOf(this), 1);
    }

    public static isCaretPlaceHolder(node: Node) {
        return node instanceof HTMLElement && node.className === "caret-placeholder"
    }

    public static addNecessaryPlaceholders(): void {
        for (let mathBox of MathBox.getMathBoxesBeforeBRs()) {
            EditingArea.addNodeBeforeNode(new CaretPlaceholder().HTMLEl, mathBox.getHTMLEl());
        }
    }

    private getChildNodes(): Node[] {
        return Array.from(this.HTMLEl.childNodes);
    }

    private hasChildren(): boolean {
        return this.getChildNodes().length > 0;
    }

    public static getSelectedCaretPlaceholder(): CaretPlaceholder {
        for (let caretPlaceholder of CaretPlaceholder.caretPlaceholders) {
            if (Caret.isInsideNode(caretPlaceholder.HTMLEl)) {
                return caretPlaceholder;
            }
        }

        return null;
    }

    public static getCaretPlaceHolders() {
        return this.caretPlaceholders;
    }

    public static removeRedundantPlaceholders(): void {
        for (let caretPlaceholder of CaretPlaceholder.caretPlaceholders) {
            if ((caretPlaceholder.HTMLEl.previousSibling && caretPlaceholder.HTMLEl.previousSibling.nodeName !== "BR")
                    || !MathBox.isMathBoxOrItsChild(caretPlaceholder.HTMLEl.nextSibling) || caretPlaceholder.hasChildren()) {
                caretPlaceholder.destroy();
            }
        }
    }

    public static removeCaretPlaceholdersNotInDOM(): void {
        for (let caretPlaceholder of CaretPlaceholder.caretPlaceholders) {
            if (!caretPlaceholder.HTMLEl.isConnected) {
                caretPlaceholder.destroy();
            }
        }
    }
}

export default CaretPlaceholder;
