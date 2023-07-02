class UtilMethods {
    public static getNodePos(node: Node, textOffset: number = 0, elPosFromRight: boolean = false): number {
        if (node instanceof HTMLElement) {
            return elPosFromRight ? node.getBoundingClientRect().right + window.scrollX
                : node.getBoundingClientRect().left + window.scrollX
        } else if (node instanceof Text) {
            let range: Range = new Range();
            range.setStart(node, textOffset);
            return range.getBoundingClientRect().right + window.scrollX;
        }
    }

    public static countOfOccurrences(str: string, match: string): number {
        return str.split(match).length - 1;
    }

    public static isChildOf(node, parentElement) {
        while (node !== null) {
            if (node === parentElement) {
                return true;
            }
            node = node.parentNode;
        }

        return false;
    }

    public static isEmptyTextNode(node: Node): node is Text {
        return node instanceof Text && node.data === "";
    }

/*    public static isElInDom(el: HTMLElement): boolean {
        return document.getElementById(el.id) !== null;
    }*/
}

export default UtilMethods;
