import InlineMathBox from "./math-editor/inline-math-box.js";
let MQ = MathQuill.getInterface(2);
window.onload = () => {
    const editingArea = document.getElementById("editing-area");
    document.addEventListener("keydown", e => {
        if (e.ctrlKey && e.code === "KeyE") {
            new InlineMathBox(editingArea);
        }
        if (e.ctrlKey && e.shiftKey && e.code === "KeyA") {
            const foo = getSelection();
            console.log(foo);
        }
        if (e.code === "ArrowRight" || e.code === "ArrowLeft") {
            InlineMathBox.changeAttrOfAllFields("contenteditable", "true");
        }
    });
    document.addEventListener("selectionchange", () => {
        InlineMathBox.changeAttrOfAllFields("contenteditable", "false");
        InlineMathBox.focusSelectedField();
    });
};
//# sourceMappingURL=renderer.js.map