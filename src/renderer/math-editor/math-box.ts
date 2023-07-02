import Cursor from "../../utils/cursor.js";
import EditingArea from "./editing-area.js";
import cursor from "../../utils/cursor.js";

let MQ: MQ.MQ = MathQuill.getInterface(2);

class InlineMathBox {
    private static Fields: InlineMathBox[] = [];
    private static FieldCount: number = 0;

    private readonly fieldIndex: number;
    private readonly id: string;
    private readonly editingArea: HTMLElement;
    private readonly htmlEl: HTMLElement;
    private readonly MQObj: MQ.MathField;

    constructor(editingArea: HTMLElement) {
        ++InlineMathBox.FieldCount;
        InlineMathBox.Fields.push(this);

        this.editingArea = editingArea;
        this.fieldIndex = InlineMathBox.FieldCount;
        this.id = `field${this.fieldIndex}`;
        this.htmlEl = document.createElement("span");
        this.htmlEl.setAttribute("id", this.id);
        this.htmlEl.setAttribute("contenteditable", "true");
        getSelection().getRangeAt(0).insertNode(this.htmlEl);

        this.MQObj = MQ.MathField(this.htmlEl, {
            handlers: {
                moveOutOf: (direction: number, _: MQ.MathField): void => {
                    if (direction === MQ.R) {
                        Cursor.setCursorAfter(this.htmlEl);
                    } else if (direction === MQ.L) {
                        Cursor.setCursorBefore(this.htmlEl);
                    }
                },
                deleteOutOf: (direction: number, _: MQ.MathField): void => {
                    Cursor.setCursorBefore(this.getHtmlEl());
                    this.destroy();
                },
                upOutOf: (_: MQ.MathField): void => {
                    let [node, offset]: [Node, number] = EditingArea.getClosestCaretLocationForLine(
                        EditingArea.getPreviousLine()
                    );
                    if (node instanceof HTMLElement) {
                        if (offset === -1) {
                            cursor.setCursorAfter(node);
                        } else {
                            cursor.setCursorBefore(node);
                        }
                    } else if (node instanceof Text) {
                        cursor.setCursorAt(node, offset);
                    }
                }
            }
        });
        this.MQObj.focus();
    }

    private destroy(): void {
        this.htmlEl.remove();
        InlineMathBox.Fields.splice(this.fieldIndex, 1);
    }

    public static changeAttrOfAllFields(attr: string, value: string): void {
        for (let mathField of InlineMathBox.Fields) {
            mathField.getHtmlEl().setAttribute(attr, value);
        }
    }

    public static focusSelectedField(direction: number): void {
        const selection: Selection = getSelection();
        for (let mathField of InlineMathBox.Fields) {
            let rangeParent: Node = selection.getRangeAt(0).commonAncestorContainer;
            let mathBoxVisibleContent = mathField.getHtmlEl().childNodes[1].childNodes;
/*            if (rangeParent instanceof Element &&
                (rangeParent.className === "mq-textarea" || rangeParent.className === "mq-root-block mq-empty")) {*/
            if (mathField.getHtmlEl().contains(rangeParent)
                && (!(mathBoxVisibleContent.length > 0)
                    || rangeParent !== mathBoxVisibleContent[mathBoxVisibleContent.length - 1])) {
                if (direction) {
                    mathField.getMQObj().moveToDirEnd(direction);
                }

                mathField.getMQObj().focus();
                break;
            }
        }
    }

    public getHtmlEl(): HTMLElement {
        return this.htmlEl;
    }

    public getMQObj(): MQ.MathField {
        return this.MQObj;
    }

    public getEditingArea(): HTMLElement {
        return this.editingArea;
    }

    public static getFields(): InlineMathBox[] {
        return this.Fields;
    }
}

export default InlineMathBox;
