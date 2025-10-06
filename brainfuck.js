"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compile = compile;
// https://gist.github.com/roachhd/dce54bec8ba55fb17d3a
// code           memory
// >+++++++++     [0][9][0][0]
// [<++++++++>-]  [0->72(8 * 9)][9->0][0][0]
// <.             print H(72)
// >+++++++       [72][0->7][0][0]
// [<++++>-]      [72->72+28(4*7)->100][7->0][0][0]
// <+.            print e(101)
// +++++++..      [101->108][0][0][0] print ll(108)
// +++.           [111][0][0][0] print o(111)
// [-]            [111->0][0][0][0]
var hello = ">+++++++++[<++++++++>-]<.>+++++++[<++++>-]<+.+++++++..+++.[-]";
// code           memory
// >++++++++      [0][8][0][0]
// [<++++>-]<.    [32(4*8)][8->0][0][0] print SP(space)(32)
// >+++++++++++   [32][9][0][0]
// [<++++++++>-]<-.
// --------.
// +++.
// ------.
// --------.[-]
// >++++++++[<++++>-]<+.
var world = ">++++++++[<++++>-]<.>+++++++++++[<++++++++>-]<-.--------.+++.------.--------.[-]>++++++++[<++++>-]<+.";
function compile(source) {
    var _a, _b;
    var memory = new Uint8Array(256);
    var tokens = source.split('');
    var pointer = 0;
    var index = 0;
    var output = "";
    var loops = [];
    while (index <= tokens.length - 1) {
        switch (tokens[index]) {
            // increases value
            case "+":
                memory[pointer]++;
                index++;
                break;
            // decreases value
            case "-":
                memory[pointer]--;
                index++;
                break;
            // increases memory pointer
            case ">":
                pointer++;
                index++;
                break;
            // decreases memory pointer
            case "<":
                pointer--;
                index++;
                break;
            // enter the loop
            case "[":
                loops.push(index);
                if (memory[pointer] === 0) {
                    var stack = 1;
                    while (stack > 0) {
                        if (tokens.length <= index) {
                            throw Error("unexpected [");
                        }
                        index++;
                        if (tokens[index] === "[") {
                            stack++;
                        }
                        else if (tokens[index] === "]") {
                            stack--;
                        }
                    }
                }
                index++;
                break;
            // jump back to [
            case "]":
                if (loops.length === 0) {
                    throw Error("unexpected ]");
                }
                if (memory[pointer] !== 0) {
                    var stack = 1;
                    while (stack > 0) {
                        index--;
                        if (tokens[index] === "[") {
                            stack--;
                        }
                        else if (tokens[index] === "]") {
                            stack++;
                        }
                    }
                }
                else {
                    index = (_a = loops.pop()) !== null && _a !== void 0 ? _a : index;
                }
                break;
            // print memory point character
            case ".":
                output += String.fromCharCode(memory[pointer]);
                index++;
                break;
            // input 1 character
            case ",":
                memory[pointer] = parseInt((_b = prompt("Please type a number:")) !== null && _b !== void 0 ? _b : "82");
                index++;
                break;
            // Invalid input
            default:
                throw Error("".concat(index, "th character, \"").concat(tokens[index], "\", is invalid input."));
        }
    }
    return output;
}
console.log(compile(hello + world));
