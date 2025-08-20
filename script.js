class Calculator {
    constructor() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
        this.shouldResetScreen = false;
        
        this.currentOperandElement = document.getElementById('current-operand');
        this.previousOperandElement = document.getElementById('previous-operand');
        this.buttonsContainer = document.getElementById('buttons-container');
        
        this.buttons = [
            { text: 'C', class: 'clear', action: 'clear' },
            { text: '⌫', class: 'delete', action: 'delete' },
            { text: '%', class: 'operator', action: 'operator' },
            { text: '÷', class: 'operator', action: 'operator' },
            { text: '7', class: 'number', action: 'number' },
            { text: '8', class: 'number', action: 'number' },
            { text: '9', class: 'number', action: 'number' },
            { text: '×', class: 'operator', action: 'operator' },
            { text: '4', class: 'number', action: 'number' },
            { text: '5', class: 'number', action: 'number' },
            { text: '6', class: 'number', action: 'number' },
            { text: '-', class: 'operator', action: 'operator' },
            { text: '1', class: 'number', action: 'number' },
            { text: '2', class: 'number', action: 'number' },
            { text: '3', class: 'number', action: 'number' },
            { text: '+', class: 'operator', action: 'operator' },
            { text: '±', class: 'number', action: 'plusMinus' },
            { text: '0', class: 'number', action: 'number' },
            { text: '.', class: 'number', action: 'decimal' },
            { text: '=', class: 'equals', action: 'equals' }
        ];
        
        this.createButtons();
        this.updateDisplay();
    }
    
    createButtons() {
        this.buttonsContainer.innerHTML = '';
        this.shuffleButtons();
        
        this.buttons.forEach((buttonData, index) => {
            const button = document.createElement('button');
            button.textContent = buttonData.text;
            button.className = `button ${buttonData.class}`;
            button.dataset.action = buttonData.action;
            button.dataset.value = buttonData.text;
            
            // Add staggered animation delay
            button.style.animationDelay = `${index * 0.05}s`;
            button.classList.add('button-enter');
            
            button.addEventListener('click', (e) => this.handleButtonClick(e));
            this.buttonsContainer.appendChild(button);
            
            // Trigger animation
            setTimeout(() => {
                button.classList.remove('button-enter');
                button.classList.add('button-enter-active');
            }, 10);
        });
    }
    
    shuffleButtons() {
        // Fisher-Yates shuffle algorithm
        for (let i = this.buttons.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.buttons[i], this.buttons[j]] = [this.buttons[j], this.buttons[i]];
        }
    }
    
    handleButtonClick(event) {
        const button = event.target;
        const action = button.dataset.action;
        const value = button.dataset.value;
        
        // Add click effect
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            button.style.transform = '';
        }, 150);
        
        // Shake the display
        this.currentOperandElement.classList.add('shake');
        setTimeout(() => {
            this.currentOperandElement.classList.remove('shake');
        }, 500);
        
        // Handle different actions
        switch (action) {
            case 'number':
                this.appendNumber(value);
                break;
            case 'operator':
                this.chooseOperation(value);
                break;
            case 'equals':
                this.compute();
                break;
            case 'clear':
                this.clear();
                break;
            case 'delete':
                this.delete();
                break;
            case 'decimal':
                this.appendDecimal();
                break;
            case 'plusMinus':
                this.plusMinus();
                break;
        }
        
        this.updateDisplay();
        
        // Rearrange buttons after every click
        setTimeout(() => {
            this.createButtons();
        }, 300);
    }
    
    appendNumber(number) {
        if (this.shouldResetScreen) {
            this.currentOperand = '';
            this.shouldResetScreen = false;
        }
        
        if (number === '0' && this.currentOperand === '0') return;
        if (this.currentOperand === '0' && number !== '.') {
            this.currentOperand = number;
        } else {
            this.currentOperand += number;
        }
    }
    
    appendDecimal() {
        if (this.shouldResetScreen) {
            this.currentOperand = '0';
            this.shouldResetScreen = false;
        }
        if (this.currentOperand.includes('.')) return;
        this.currentOperand += '.';
    }
    
    plusMinus() {
        if (this.currentOperand === '0') return;
        this.currentOperand = this.currentOperand.startsWith('-') 
            ? this.currentOperand.slice(1) 
            : '-' + this.currentOperand;
    }
    
    chooseOperation(operation) {
        if (this.currentOperand === '') return;
        if (this.previousOperand !== '') {
            this.compute();
        }
        
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.shouldResetScreen = true;
    }
    
    compute() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        
        if (isNaN(prev) || isNaN(current)) return;
        
        switch (this.operation) {
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case '×':
                computation = prev * current;
                break;
            case '÷':
                if (current === 0) {
                    this.currentOperand = 'Error';
                    this.shouldResetScreen = true;
                    return;
                }
                computation = prev / current;
                break;
            case '%':
                computation = prev % current;
                break;
            default:
                return;
        }
        
        this.currentOperand = computation.toString();
        this.operation = undefined;
        this.previousOperand = '';
        this.shouldResetScreen = true;
    }
    
    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
        this.shouldResetScreen = false;
    }
    
    delete() {
        if (this.currentOperand === '0') return;
        if (this.currentOperand.length === 1) {
            this.currentOperand = '0';
        } else {
            this.currentOperand = this.currentOperand.slice(0, -1);
        }
    }
    
    getDisplayNumber(number) {
        const stringNumber = number.toString();
        const integerDigits = parseFloat(stringNumber.split('.')[0]);
        const decimalDigits = stringNumber.split('.')[1];
        
        let integerDisplay;
        if (isNaN(integerDigits)) {
            integerDisplay = '';
        } else {
            integerDisplay = integerDigits.toLocaleString('en', {
                maximumFractionDigits: 0
            });
        }
        
        if (decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`;
        } else {
            return integerDisplay;
        }
    }
    
    updateDisplay() {
        this.currentOperandElement.textContent = this.getDisplayNumber(this.currentOperand);
        
        if (this.operation != null) {
            this.previousOperandElement.textContent = 
                `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`;
        } else {
            this.previousOperandElement.textContent = '';
        }
    }
}

// Initialize calculator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Calculator();
});

// Add some fun background animation
document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    let hue = 0;
    
    setInterval(() => {
        hue = (hue + 0.1) % 360;
        body.style.background = `linear-gradient(135deg, hsl(${hue}, 70%, 60%) 0%, hsl(${(hue + 60) % 360}, 70%, 50%) 100%)`;
    }, 50);
});
