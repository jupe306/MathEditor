import MathBox from "./math-box.js";
import CaretPlaceholder from "./caretPlaceholder.js";

let MQ: MQ.MQ = MathQuill.getInterface(2);

class EditingArea {
    public static node: HTMLElement = document.getElementById("editing-area");

    public static isNodeEditingArea(node: Node): boolean {
        return node instanceof HTMLElement && node.id === "editing-area";
    }

    public static getChildNodes(): ChildNode[] {
        return Array.from(EditingArea.node.childNodes);
    }

    public static addNodeToCaretPos(node: Node): void {
        getSelection().getRangeAt(0).insertNode(node);
    }

    public static addNodeAfterNode(nodeBefore: Node, nodeAfter: Node): void {
        let range: Range = new Range();
        range.setStartAfter(nodeBefore);

        range.insertNode(nodeAfter);
    }

    public static addNodeBeforeNode(nodeBefore: Node, nodeAfter: Node): void {
        let range: Range = new Range();
        range.setStartBefore(nodeAfter);

        range.insertNode(nodeBefore);
    }

    public static ensureEndingBR(): void {
        let lastNode: Node = EditingArea.getChildNodes().at(-1);
        if (lastNode && lastNode.nodeName !== "BR") {
            EditingArea.addNodeAfterNode(lastNode, document.createElement("br"));
        }
    }

    public static update(): void {
        EditingArea.ensureEndingBR();

        MathBox.removeMathBoxesNotInDOM();

        CaretPlaceholder.removeCaretPlaceholdersNotInDOM()
        CaretPlaceholder.removeRedundantPlaceholders();
        CaretPlaceholder.addNecessaryPlaceholders();
    }
}

export default EditingArea;
