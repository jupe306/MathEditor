console.log("test");
/*
import * as $ from "../../node_modules/jquery/dist/jquery.min.js";
import "../../node_modules/mathquill/build/mathquill.js";*/
import MathField from "./math-editor/math-field.js";

declare let MathQuill: any;

let MQ = MathQuill.getInterface(2);

window.onload = () => {
    const editingArea = document.getElementById("editing-area");

    document.addEventListener("keydown", e => {
        if (e.ctrlKey && e.code === "KeyE") {
            new MathField(editingArea);
        }
        if (e.ctrlKey && e.shiftKey && e.code === "KeyA") {
            const foo = getSelection();
            console.log(foo)
        }
        if (e.code === "ArrowRight" || e.code === "ArrowLeft") {
            MathField.changeAttrOfAllFields("contenteditable", "true");
        }
    });

    document.addEventListener("selectionchange", () => {
        MathField.changeAttrOfAllFields("contenteditable", "false");
        MathField.focusSelectedField();
    });
}
