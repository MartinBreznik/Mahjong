import React from "react";
import { createSocketComm } from "./socketComm";

interface ISelectedTile { layer: number, row:number, column: number, type:number}
interface IScores {player: number, opponent: number}

export function createState(
    inParentComponent: React.Component
){
    return{
        layout : <number[][][]>[ ],
        selectedTiles : <ISelectedTile[]>[ ],
        scores : <IScores>{ player : 0, opponent : 0 },
        gameState : <string>"awaitingOpponent",
        gameOutcome : <string>"",
        pid : <string>"",
        socketComm : <Function>createSocketComm(inParentComponent),
        timeSinceLastMatch : <number>0,
        
        handleMessage_connected : function(inPID: string) {
            this.setState({pid : inPID });
        }.bind(inParentComponent),

        handleMessage_start: function(inLayout: number[][][]) {
            this.setState({
                timeSinceLastMatch : new Date().getTime(),
                layout : inLayout,
                gameState : "playlist"
            });
        }.bind(inParentComponent),

        handleMessage_update:
        function(inPID: string, inScore: number) {
            if (inPID !== this.state.pid) {
                const scores: IScores = { ...this.state.scores };
                scores.opponent = inScore;
                this.setState({ scores : scores });
            }
        }.bind(inParentComponent),

        handleMessage_gameOver: function(inPID: string) {
            if(inPID === this.state.pid) {
                this.setState({ gameState : "gameOver",
            gameOutcome : "Tough luck, you lost :("});
            }
        }.bind(inParentComponent),

        tileClick : function(inLayer: number, inRow: number, inColumn: number){
            if (this.state.gameState !== "playing"){
                return;
            }
            if(!this.state.canTileBeSelected(inLayer, inRow, inColumn)) {
                return;
            }

            const layout: number[][][] = this.state.layout.slice(0);

            const currentTileValue: number = layout[inLayer][inRow][inColumn];

            if(currentTileValue <= 0){
                return;
            }
            const scores: IScores = {...this.state.scores};
            let gameState: string = this.state.gameState;
            let timeSinceLastMatch: number = this.state.timeSinceLastMatch;
            let selectedTiles: ISelectedTile[] = this.state.selectedTiles.slice(0);
        }
    }
}