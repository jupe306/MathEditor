import UtilMethods from "./util-methods.js";
import EditingArea from "../renderer/math-editor/editing-area.js";
import MathBox from "../renderer/math-editor/math-box.js";

let MQ: MQ.MQ = MathQuill.getInterface(2);

class Caret {
    public static setBefore(node: Node): void {
        let range: Range = new Range();
        let selection: Selection = getSelection();

        range.setStartBefore(node);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
    }

    public static setAfter(node: Node): void {
        let range: Range = new Range();
        let selection: Selection = getSelection();

        range.setStartAfter(node);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
    }

    public static setAt(textNode: Node, offset: number): void {
        let range: Range = new Range();
        let selection: Selection = getSelection();

        range.setStart(textNode, offset);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
    }

    public static setAtClosestNodeOn(line: Node[]): void {
        let nodeAndOffset: [Node, number] | null = Caret.getClosestLocationFor(
            line
        );
        if (nodeAndOffset) {
            let [node, offset]: [Node, number] = nodeAndOffset;
            if (MathBox.isMathBoxOrItsChild(node)) {
                if (offset === -1) {
                    Caret.setAfter(node);
                } else if (offset === -2) {
                    MathBox.getMathBox(node.id).focus(MQ.L);
                } else {
                    Caret.setBefore(node);
                }
            } else if (node instanceof Text || node.nodeName === "BR") {
                Caret.setAt(node, offset);
            }
        }
    }

    public static getClosestLocationFor(line: Node[]): [Node, number] | null {
        if (line === null) {
            return null;
        }

        let caretPos: number = Caret.getGlobalX(),
            distances: Map<number, [Node, number]> = new Map();
        let closestPos: number, closestNode: Node, closestNodeOffset: number;

        for (let node of line) {
            if (node instanceof Text) {
                for (let i: number = 0; i <= node.data.length; ++i) {
                    distances.set(Math.abs(UtilMethods.getNodePos(node, i) - caretPos), [node, i]);
                }
            } else if (MathBox.isMathBoxOrItsChild(node)) {
                distances.set(Math.abs(UtilMethods.getNodePos(node) - caretPos), [node, 0]);
                distances.set(Math.abs(UtilMethods.getNodePos(node, 0, true) - caretPos), [node, -1]);
            } else if (node.nodeName === "BR") {
                distances.set(Math.abs(UtilMethods.getNodePos(node) - caretPos), [node, 0]);
            }
        }

        closestPos = Math.min(...distances.keys());
        [closestNode, closestNodeOffset] = distances.get(closestPos);
        if (MathBox.isMathBoxOrItsChild(closestNode)
            && (UtilMethods.getNodePos(closestNode) <= caretPos
                && caretPos <= UtilMethods.getNodePos(closestNode, 0, true))) {
            return [closestNode, -2];
        }

        return [closestNode, closestNodeOffset];
    }

    public static getPreviousLine(): Node[] {
        /* known bug: returns an empty list when caret is on an empty line */
        let node: Node = getSelection().focusNode,
            firstLineBreakFound: boolean = false,
            nodes: Node[] = [];

        while (true) {
            if (node.previousSibling) {
                node = node.previousSibling
            } else if (MathBox.isMathBoxOrItsChild(node.parentNode)) {
                node = node.parentNode;
                continue;
            } else {
                break;
            }

            if (node.nodeName === "BR") {
                if (firstLineBreakFound) {
                    return nodes;
                } else {
                    nodes.push(node);
                    firstLineBreakFound = true;
                }
            } else if (firstLineBreakFound) {
                if (!(UtilMethods.isEmptyTextNode(node))) {
                    nodes.unshift(node);
                }
            }
        }

        return nodes;
    }

    public static getNextLine(): Node[] {
        /* known bug: returns an empty list when caret is on an empty line */
        let node: Node = getSelection().focusNode,
            firstLineBreakFound: boolean = false,
            nodes: Node[] = [];

        while (true) {
            if (node.nextSibling) {
                node = node.nextSibling
            } else if (MathBox.isMathBoxOrItsChild(node.parentNode)) {
                node = node.parentNode;
                continue;
            } else {
                break;
            }

            if (node.nodeName === "BR") {
                if (firstLineBreakFound) {
                    nodes.push(node);
                    return nodes;
                } else {
                    firstLineBreakFound = true;
                }
            } else if (firstLineBreakFound) {
                if (!(UtilMethods.isEmptyTextNode(node))) {
                    nodes.push(node);
                }
            }
        }

        return nodes;
    }

    public static getNextVisibleNode(): Node {
        let node: Node = getSelection().anchorNode;
        let offset: number = getSelection().anchorOffset;
        let editingAreaNodes: Array<Node> = EditingArea.getChildNodes();

        if (EditingArea.isNodeEditingArea(node)) {
            for (let i: number = offset; i < editingAreaNodes.length; ++i) {
                if (UtilMethods.isEmptyTextNode(editingAreaNodes[i])) {
                    continue;
                } else {
                    return editingAreaNodes[i];
                }
            }
            return null;
        } else if (node) {
            while (true) {
                node = node.nextSibling;
                if (node) {
                    if (UtilMethods.isEmptyTextNode(node)) {
                        continue;
                    } else {
                        return node;
                    }
                } else {
                    return null;
                }
            }
        }

        return null;
    }

    public static getPreviousVisibleNode(): Node {
        let node: Node = getSelection().anchorNode;
        let offset: number = getSelection().anchorOffset;
        let editingAreaNodes: Array<Node> = EditingArea.getChildNodes();

        if (EditingArea.isNodeEditingArea(node)) {
            for (let i: number = offset - 1; i >= 0; --i) {
                if (UtilMethods.isEmptyTextNode(editingAreaNodes[i])) {
                    continue;
                } else {
                    return editingAreaNodes[i];
                }
            }
            return null;
        } else if (node) {
            while (true) {
                node = node.previousSibling;
                if (node) {
                    if (UtilMethods.isEmptyTextNode(node)) {
                        continue;
                    } else {
                        return node;
                    }
                } else {
                    return null;
                }
            }
        }

        return null;
    }

    public static getTheNeighbouringMathBox(direction: number): MathBox | null {
        let anchorNode: Node = getSelection().anchorNode;
        let anchorOffset: number = getSelection().anchorOffset;
        let previousVisibleNode: Node, nextVisibleNode: Node;

        if (direction === MQ.R) {
            nextVisibleNode = Caret.getNextVisibleNode();
            if (nextVisibleNode && (!(anchorNode instanceof Text) || anchorOffset === anchorNode.length)
                && MathBox.isMathBoxOrItsChild(nextVisibleNode)) {
                return MathBox.getMathBox(nextVisibleNode.id);
            }
        } else if (direction === MQ.L) {
            previousVisibleNode = Caret.getPreviousVisibleNode();
            if (previousVisibleNode && (!(anchorNode instanceof Text) || anchorOffset === 0)
                && MathBox.isMathBoxOrItsChild(previousVisibleNode)) {
                return MathBox.getMathBox(previousVisibleNode.id)
            }
        }

        return null;
    }

    public static getGlobalX(): number {
        let range: Range = getSelection().getRangeAt(0),
            selectedNode: Node = range.startContainer,
            offset: number = range.startOffset;

        if (range.startContainer instanceof HTMLElement && range.startContainer.className === "mq-textarea") {
            selectedNode = document.getElementsByClassName("mq-cursor")[0];
            offset = 0;
        }

        return UtilMethods.getNodePos(selectedNode, offset);
    }

    public static isInsideNode(node: Node): boolean {
        let anchorNode: Node = getSelection().anchorNode;
        let anchorOffset: number = getSelection().anchorOffset;

        if (anchorNode !== getSelection().focusNode) {
            return false;
        }

        if (EditingArea.isNodeEditingArea(anchorNode)) {
            anchorNode = EditingArea.getChildNodes()[anchorOffset - 1];
        }

        return anchorNode === node || node.contains(anchorNode);
    }
}

export default Caret;
