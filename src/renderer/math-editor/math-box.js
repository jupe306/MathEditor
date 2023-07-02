import Cursor from "./cursor.js";
let MQ = MathQuill.getInterface(2);
class MathBox {
    constructor(editingArea) {
        ++InlineMathBox.FieldCount;
        InlineMathBox.Fields.push(this);
        this.editingArea = editingArea;
        this.id = `field${InlineMathBox.FieldCount}`;
        this.node = document.createElement("span");
        this.node.setAttribute("id", this.id);
        this.node.setAttribute("contenteditable", "true");
        getSelection().getRangeAt(0).insertNode(this.node);
        this.MQObj = MQ.MathField(this.node, {
            handlers: {
                moveOutOf: (direction, mathField) => {
                    if (direction === MQ.R) {
                        Cursor.setCursorAfter(this.node);
                    }
                    else if (direction === MQ.L) {
                        Cursor.setCursorBefore(this.node);
                    }
                }
            }
        });
        this.MQObj.focus();
    }
    static changeAttrOfAllFields(attr, value) {
        for (let mathField of InlineMathBox.Fields) {
            mathField.getNode().setAttribute(attr, value);
        }
    }
    static focusSelectedField() {
        const selection = window.getSelection();
        for (let mathField of InlineMathBox.Fields) {
            if (mathField.getNode().contains(selection.getRangeAt(0).commonAncestorContainer)) {
                mathField.getMQObj().focus();
                break;
            }
        }
    }
    getNode() {
        return this.node;
    }
    getMQObj() {
        return this.MQObj;
    }
    getEditingArea() {
        return this.editingArea;
    }
    static getFields() {
        return this.Fields;
    }
}
InlineMathBox.Fields = [];
InlineMathBox.FieldCount = 0;
export default InlineMathBox;
//# sourceMappingURL=inline-math-box.js.map