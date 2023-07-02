import MathBox from "./math-editor/math-box.js";
import Caret from "../utils/caret.js";
import EditingArea from "./math-editor/editing-area.js";
import CaretPlaceholder from "./math-editor/caretPlaceholder.js";

let MQ: MQ.MQ = MathQuill.getInterface(2);

window.onload = (): void => {
    document.addEventListener("keydown", e => {
        if (e.ctrlKey && e.code === "KeyE") {
            if (!MathBox.isAnyMathBoxFocused()) {
                new MathBox();
                EditingArea.update();
            }
        } else if ((e.ctrlKey && e.code === "KeyZ") || (e.ctrlKey && e.shiftKey && e.code === "KeyZ")
                || (e.ctrlKey && e.code === "KeyR") || (e.ctrlKey && e.code === "KeyW")) {
            e.preventDefault();
        } else if (e.ctrlKey && e.shiftKey && e.code === "KeyA") {
            let anchor = getSelection().anchorNode;
            console.log(getSelection().anchorNode, getSelection().anchorOffset)
            if (anchor instanceof HTMLElement) {
                console.log(anchor.id)
            }
        } else if (e.ctrlKey && e.shiftKey && e.code === "KeyB") {
            console.log(MathBox.isAnyMathBoxFocused())
        } else if (e.code === "ArrowRight") {
            let mathBox: MathBox = Caret.getTheNeighbouringMathBox(MQ.R);
            if (mathBox) {
                if (e.ctrlKey) {
                    e.preventDefault();
                    Caret.setAfter(mathBox.getHTMLEl());
                } else {
                    mathBox.focus(MQ.L);
                }
            }
        } else if (e.code === "ArrowLeft") {
            let mathBox: MathBox = Caret.getTheNeighbouringMathBox(MQ.L);
            if (mathBox) {
                if (e.ctrlKey) {
                    e.preventDefault();
                    Caret.setBefore(mathBox.getHTMLEl());
                } else {
                    mathBox.focus(MQ.R);
                }
            }
        } else if (e.code === "ArrowUp" || e.code === "ArrowDown") {
            let selectedCaretPlaceholder: CaretPlaceholder = CaretPlaceholder.getSelectedCaretPlaceholder();
            if (selectedCaretPlaceholder !== null) {
                selectedCaretPlaceholder.getHTMLEl().setAttribute("contenteditable", "false");
                setTimeout(
                    () => selectedCaretPlaceholder.getHTMLEl()
                                  .setAttribute("contenteditable", "true."),
                    0
                );
            }
        }
    });

    EditingArea.node.addEventListener("input", (): void => {
        EditingArea.update();
    });
}
