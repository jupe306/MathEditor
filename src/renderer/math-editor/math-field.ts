/*
import * as $ from "../../../node_modules/jquery/dist/jquery.min.js";
import "../../../node_modules/mathquill/build/mathquill.js";
*/

import Cursor from "./cursor.js";
import EditingArea from "./editing-area.js";

declare let MathQuill: any;

let MQ = MathQuill.getInterface(2);

class MathField {
    private static Fields = [];
    private static FieldCount = 0;

    private id;
    private editingArea;
    private node;
    private MQObj;

    constructor(editingArea) {
        ++MathField.FieldCount;
        MathField.Fields.push(this);

        this.editingArea = editingArea;

        this.id = `field${MathField.FieldCount}`;
        this.node = document.createElement("span");
        this.node.setAttribute("id", this.id);
        this.node.setAttribute("contenteditable", true);
        getSelection().getRangeAt(0).insertNode(this.node);

        this.MQObj = MQ.MathField(this.node, {
            handlers: {
                moveOutOf: (direction, mathField) => {
                    if (direction === MQ.R) {
                        Cursor.setCursorAfter(this.node);
                    } else if (direction === MQ.L) {
                        Cursor.setCursorBefore(this.node);
                    }
                }
            }
        });

        this.MQObj.focus();
    }

    static changeAttrOfAllFields(attr, value) {
        for (let mathField of MathField.Fields) {
            mathField.getNode().setAttribute(attr, value);
        }
    }

    static focusSelectedField() {
        const selection = window.getSelection();
        for (let mathField of MathField.Fields) {
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

export default MathField;
