// select canvas
const lifeGrid = document.querySelector('#game_of_life_grid');
// creat context
const c = lifeGrid.getContext('2d');
//size of cells
let s = 20


let reduceLifeGrid = () => {
    lifeGrid.width = innerWidth * 0.9 - (innerWidth * 0.9 % s)
    lifeGrid.height = innerHeight * 0.8 - (innerHeight * 0.8 % s)
}



let game_of_life = () => {
    reduceLifeGrid();
    const sizeOfGrid = {
        rows: lifeGrid.height / s,
        colums: lifeGrid.width / s
    }
    let Cel = function(row, col, state){
        this.row = row;
        this.col = col;
        this.state = state;
        this.nextState = undefined;
        this.aliveNeighbour = undefined;
        //method for calculating alive neigbours
        this.countAlive = function() {
            let count = 0
            for (let r = (row === 0 ? row : (row - 1) ) ; r <= ( row === (sizeOfGrid.rows - 1) ? row : (row + 1) ) ; r++){
                for (let c = (!col ? col : (col - 1) ) ; c <= ( col === (sizeOfGrid.colums - 1) ? col : (col + 1) ) ; c++){
                    if ( r !== row || c !== col ) {
                        if(grid[r][c].state){ 
                            count++;
                        }
                    }
                }
            }
            this.aliveNeighbour = count;
        }
        //method for calculating next state
        this.calcNextState = function(){
            this.countAlive();
            if (this.state === 0 && this.aliveNeighbour !== 3){ // no codition to born
                this.nextState = 0;
            } else if (this.state === 0 && this.aliveNeighbour === 3){ // perfect conditon to born
                this.nextState = 1;    
            } else if (this.state && (this.aliveNeighbour === 3 || this.aliveNeighbour === 2)){ // life is nice
                this.nextState = 1;    
            } else {  // no friends, to many friends - time to die
                this.nextState = 0;    
            }
        }
        this.changeState = function(){
            this.state = Math.abs(this.state - 1)
            calcNextGen()
            printGrid()
        }
    }
    
    // calkulate next state
    let calcNextGen = () => {
        grid.forEach( row => {
            row.forEach( el => {
                el.calcNextState()
            })
        })
    } 
    // Next Gen
    let nextGen = () => {
        grid.forEach( row => {
            row.forEach( el => {
                el.state = el.nextState;
            
            })
        })
    } 
    let randomState = () => {
        grid.forEach( row => {
            row.forEach( el => {
                el.state = Math.floor((Math.abs(Math.random()-0.2))*2);
                el.nextState = undefined;
            })
        })
    } 
    let reset = () => {
        grid.forEach( row => {
            row.forEach( el => {
                el.state = 0;
                el.nextState = undefined;
            })
        })
    } 


    let grid = new Array(sizeOfGrid.rows)
    for (let r = 0; r < grid.length; r++) {
        grid[r] = new Array(sizeOfGrid.colums) 
        for (let c = 0; c < grid[r].length; c++) {
            //set cels with random states 0 or 1
            grid[r][c] = new Cel(r, c, 0 );//Math.floor((Math.abs(Math.random()-0.4))*2)
        }
    }
    
    let printCel = (x, y, state) =>  {
        c.beginPath();
        c.arc(x, y, s/2, 0, Math.PI*2, false);
        c.lineWidth = 0.2;
        c.strokeStyle = '#444';
        c.stroke();
        c.fillStyle = state === 0 ? '#fff' : '#aaa';
        c.fill()
    }

    let printGrid = () => {
        let staringXPoint = s/2;
        let staringYPoint = s/2;

        let fillRow = () => {
            if ( staringYPoint < (Math.floor(lifeGrid.height ))) {
                for (let i = 0; i < sizeOfGrid.colums; i++) {
                    let col = Math.floor(staringXPoint/s)
                    let row = Math.floor(staringYPoint/s)
                    let celState = grid[row][col].state
                    printCel( staringXPoint, staringYPoint, celState)
                    staringXPoint += s  
                    if (i === sizeOfGrid.colums -1) {
                        staringXPoint = s/2;
                        staringYPoint += s;
                        fillRow()
                    }
                }
            }

        }
        fillRow()
    }

    let animID;
    let action = false;
    let lifeTime = () => {
        animID = requestAnimationFrame(lifeTime);
        
        //clear grid
        c.clearRect(0, 0, lifeGrid.width, lifeGrid.height);
        //set state = nextState & => calculate nextState
        nextGen()
        calcNextGen()
        //print grid
        printGrid()

    }
    document.querySelector('#btn-next').addEventListener('click', () => {
        nextGen()
        calcNextGen()
        c.clearRect(0, 0, lifeGrid.width, lifeGrid.height);
        printGrid()
    })
    
    document.querySelector('#btn-start-stop').addEventListener('click', () => {
        if(action) {
            cancelAnimationFrame(animID)
            action = !action
        } else if (!action) {
            lifeTime()
            action = !action
        }
    })

    document.querySelector('#btn-random').addEventListener('click', () => {
        randomState()
        calcNextGen()
        c.clearRect(0, 0, lifeGrid.width, lifeGrid.height);
        printGrid()
    })
     
    document.querySelector('#btn-reset').addEventListener('click', () => {
        reset()
        c.clearRect(0, 0, lifeGrid.width, lifeGrid.height);
        printGrid()
    })
    let mouseClick = {
        x: undefined,
        y: undefined
    }
    lifeGrid.addEventListener('click' , (e) => {
        const clickCol = Math.floor(e.layerX/s);
        const clickRow = Math.floor(e.layerY/s);
        c.clearRect(0, 0, lifeGrid.width, lifeGrid.height);
        grid[clickRow][clickCol].changeState()
    })
    calcNextGen();
    printGrid();
}

game_of_life(s)

window.addEventListener('resize', () => {
    game_of_life(s)
})
