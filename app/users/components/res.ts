class Chain {
    private result: number | undefined;

    setResult(value: number) {
        this.result = value;
    }

    getResult() {
        if (this.result !== undefined) {
            return this.result;
        } else {
            throw new Error("Result is undefined. Set the result first.");
        }
    }
}

const add = (a: number, b: number) => a + b;
const subtract = (a: number, b: number) => a - b;

const createChain = (initialValue: number) => {
    const chain = new Chain();
    chain.setResult(initialValue);

    return {
        execute: (operation: (a: number, b: number) => number) => {
            if (chain.getResult() !== undefined) {
                const currentResult = chain.getResult();
                return createChain(operation(currentResult, 0));
            } else {
                throw new Error("Result is undefined. Set the result first.");
            }
        },
        getResult: () => chain.getResult(),
    };
};

const result = createChain(10)
    .execute(add)
    .execute((a, b) => a + b) 
    .execute(subtract)
    .getResult();

console.log(result);
