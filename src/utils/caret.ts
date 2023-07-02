import UtilMethods from "./util-methods.js";

class Cursor {
    public static setCursorBefore(node: Node): void {
        let range: Range = new Range();
        let selection: Selection = getSelection();

        range.setStartBefore(node);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
    }

    public static setCursorAfter(node: Node): void {
        let range: Range = new Range();
        let selection: Selection = getSelection();

        range.setStartAfter(node);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
    }

    public static setCursorAt(textNode: Text, offset: number): void {
        let range: Range = new Range();
        let selection: Selection = getSelection();

        range.setStart(textNode, offset);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
    }

    public static getCaretGlobalX(): number {
        let range: Range = getSelection().getRangeAt(0),
            selectedNode: Node = range.startContainer,
            offset: number = range.startOffset;

        if (range.startContainer instanceof HTMLElement && range.startContainer.className === "mq-textarea") {
            selectedNode = document.getElementsByClassName("mq-cursor")[0];
            offset = 0;
        }

        return UtilMethods.getNodePos(selectedNode, offset);
    }

    public isCaretAtTheRightEndOfATextNode

/*
    static getCurrentCursorPosition(parentElement) {
        let selection = window.getSelection(),
            charCount = -1,
            node;

        if (selection.focusNode) {
            if (UtilMethods.isChildOf(selection.focusNode, parentElement)) {
                node = selection.focusNode;
                charCount = selection.focusOffset;

                while (node) {
                    if (node === parentElement) {
                        break;
                    }
                    if (node.previousSibling) {
                        node = node.previousSibling;
                        charCount += node.textContent.length;
                    } else {
                        node = node.parentNode;
                        if (node === null) {
                            break;
                        }
                    }
                }
            }
        }

        return charCount;
    }
*/

 /*   static setCurrentCursorPosition(chars, element) {
        if (chars >= 0) {
            var selection = window.getSelection();

            let range = Cursor.createRange(element, { count: chars });

            if (range) {
                range.collapse(false);
                selection.removeAllRanges();
                selection.addRange(range);
            }
        }
    }

    static createRange(node, chars, range) {
        if (!range) {
            range = document.createRange()
            range.selectNode(node);
            range.setStart(node, 0);
        }

        if (chars.count === 0) {
            range.setEnd(node, chars.count);
        } else if (node && chars.count > 0) {
            if (node.nodeType === Node.TEXT_NODE) {
                if (node.textContent.length < chars.count) {
                    chars.count -= node.textContent.length;
                } else {
                    range.setEnd(node, chars.count);
                    chars.count = 0;
                }
            } else {
                for (let lp = 0; lp < node.childNodes.length; lp++) {
                    range = Cursor.createRange(node.childNodes[lp], chars, range);

                    if (chars.count === 0) {
                    break;
                    }
                }
            }
        }

        return range;
    }*/
}

export default Cursor;
