import React, { Component } from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

export default class QuizPageView extends Component {
    
    constructor(props){
        super(props);
        this.state = {
            checked: false,
            API_KEY: "https://opentdb.com/api.php?amount=10&type=multiple",
            token: undefined,
            QNAs: {},
            score: 0,
            problemNum: 1
        };

        this.updateScore = this.updateScore.bind(true);
    }
    
    componentWillMount(){
        this.authUnsub= firebase.auth().onAuthStateChanged((user)=>{
            this.setState({currentUser:user})
        });
    }

    componentDidMount(){
        fetch(this.state.API_KEY)
        .then(response => response.json())
        .then((data)=>{
            let myQNAs ={};
            var h = 1;
            data.results.forEach(function(elem){
                let QNA = {
                    number:h,
                    question:"",
                    answers:[],
                    answer:""
                };
                let q = elem.question.replace(/&quot;/g,'"').replace(/&#039;/g,"'");
                var anss = [];
                for(let i=0;i<elem.incorrect_answers.length;i++){
                    anss.push(elem.incorrect_answers[i].replace(/&quot;/g,'"').replace(/&#039;/g,"'").replace(/&scaron;/g,"š"));
                }
                var ans = elem.correct_answer.replace(/&quot;/g,'"').replace(/&#039;/g,"'").replace(/&scaron;/g,"š");
                QNA.question = q;
                QNA.answers = anss;
                QNA.answer = ans;
                QNA.answers.push(QNA.answer);
                myQNAs[h] = QNA;
                h++;
            })
            for(let i = 1;i <= data.results.length; i++){
                this.shuffleArray(myQNAs[i].answers);
            }
            this.setState({QNAs : myQNAs});
        })
        .catch(err => console.error(err));    
    }

    componentWillUnMount(){
        this.authUnsub();
        // setUserProperty(score and date)
    }
    
    shuffleArray(array) {
        for (var i = array.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
    }

    handleAnswer(evt){
        evt.preventDefault();
        let h = this.state.problemNum;
        h++;
        this.setState({
            problemNum: h
        })
        
    }
    updateScore(){

    }
    render(){
        return(
            <div id = "quiz">
                <form onSubmit = {(evt)=>this.handleAnswer(evt)}>
                    <Quiz problem = {this.state.QNAs[this.state.problemNum]} score = {this.state.score} scoreCallBack = {() =>{this.updateScore}} />
                    <button className="btn btn-primary" type="submit">Next -></button>
                </form>
            </div>
        );
    }
}

class Quiz extends Component {
    constructor(props){
        super(props);
        this.state={
            selectedOption: undefined
        }
    }
    scoreCallBack(){

    }

    handleOptionChange(changeEvent) {
        this.setState({
          selectedOption: changeEvent.target.value
        });
    }

    render(){
        console.log(this.props.problem);
        return (
            <div>
                {this.props.problem !== undefined ?
                <div>
                    <div id = "score">{this.props.score} of 10</div>
                    <div id = "question" className = "alert alert-success">{this.props.problem.number}.{" "+this.props.problem.question}</div>
                        <form>
                            <div className="radio">
                            <label>
                                <input type="radio" value={this.props.problem.answers[0]} 
                                            checked={this.state.selectedOption ===  this.props.problem.answers[0]} 
                                            onChange={(evt)=>this.handleOptionChange(evt)} />
                                {" "+this.props.problem.answers[0]}
                            </label>
                            </div>
                            <div className="radio">
                            <label>
                                <input type="radio" value={this.props.problem.answers[1]}
                                            checked={this.state.selectedOption === this.props.problem.answers[1]} 
                                            onChange={(evt)=>this.handleOptionChange(evt)} />
                                {" "+this.props.problem.answers[1]}
                            </label>
                            </div>
                            <div className="radio">
                            <label>
                                <input type="radio" value={this.props.problem.answers[2]}
                                            checked={this.state.selectedOption === this.props.problem.answers[2]} 
                                            onChange={(evt)=>this.handleOptionChange(evt)} />
                                {" "+this.props.problem.answers[2]}
                            </label>
                            </div>
                            <div className="radio">
                            <label>
                                <input type="radio" value={this.props.problem.answers[3]}
                                            checked={this.state.selectedOption === this.props.problem.answers[3]} 
                                            onChange={ (evt)=>this.handleOptionChange(evt)} />
                                {" "+this.props.problem.answers[3]}
                            </label>
                            </div>
                        </form>
                </div>
                : undefined}
            </div>
        );

    }
}

