import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { QuizService } from 'src/app/quiz.service';
import { observable } from 'rxjs';


@Component({
  selector: 'app-quizquestions',
  templateUrl: './quizquestions.component.html',
  styleUrls: ['./quizquestions.component.css']
})
export class QuizquestionsComponent implements OnInit {
  filename: any;
  quetion;
  correctCount = 0;
  incorrectCount = 0;
  totalQueCount=0;
  selectedAns="";
  testJson: any;
  currentScreencount=0;
  testFilearr = 0;
  atteptCount = 0;
  showResult: boolean;
  percentage: number;
  status: string;
  audioObj = new Audio();
  allQueArray=[];
 selectedArray = [];

  constructor(private http: HttpClient, public quizService: QuizService) { }

  ngOnInit(): void {

  
    this.setInitialdata();
  }

  setInitialdata() {
    this.quizService.getdata().subscribe(data => {
      this.testJson = data;
      //console.log("testJson data", data);
      this.filename = this.testJson.questions[this.testFilearr].items[0];
      if (this.filename) {
        this.http.get('/assets/' + this.filename).subscribe(data => {
          this.quetion = data;
          // this.selectedAns="A"
          this.atteptCount = this.atteptCount + 1;
        });
      }
      for (let index = 0; index < this.testJson.questions.length; index++) {
        this.totalQueCount = this.totalQueCount + this.testJson.questions[index].items.length;
        for (let ind = 0; ind < this.testJson.questions[index].items.length; ind++) {
          const ele = this.testJson.questions[index].items[ind];
          this.allQueArray.push(ele);
        }
      }
      //console.log("allQueArray", this.allQueArray)
     // console.log(this.totalQueCount)
    });
 
  }

  onRadioBtnClick(ans) {
    this.selectedAns = ans;
    // console.log(" this.selectedAns.", this.selectedAns)
    
  }

  previousPage() {
    console.log("previousPage");
    this.selectedAns = '';
    // myTest();
    if (this.currentScreencount >= 1) {
      this.currentScreencount = this.currentScreencount - 1;
      console.log(" element.value", this.currentScreencount)
      this.filename = this.allQueArray[this.currentScreencount];
      if (this.filename) {
 
        this.http.get('/assets/' + this.filename).subscribe(data => {
          this.quetion = data;
        });
      }
      // console.log(" element.this.selectedArray", this.selectedArray)
      this.selectedArray.forEach(element => {
        console.log("this.filename == element.key", this.filename, this.filename == element.key)
        if (this.filename == element.key) {
          this.selectedAns = element.value;
          // console.log(" element.value", element.value)
        }

      });
    }
  }

  nextPage() {
      //    this.selectedArray.forEach(element => {
     
      //   if (this.filename !== element.key) {
      //     let obj = {
      //       key: this.filename,
      //       value: this.selectedAns
      //     }
      //     this.selectedArray.push(obj);
      //     console.log(this.selectedArray)
      //   } else {
      //     this.selectedAns = element.value;
      //   }

      // });
    if (this.selectedAns != "") {
      if (this.selectedAns === this.quetion.correct) {
       
        if (this.testFilearr < this.testJson.questions.length) {
          this.correctCount = this.correctCount + 1;
          this.audioplay("/assets/audio/correctAns.mp3");
          
        
          // console.log("this.correctCount", this.correctCount);

          this.forCheking();
        }
   
      } else {

        if (this.testFilearr < this.testJson.questions.length) {
          this.incorrectCount = this.incorrectCount + 1;
          this.audioplay("/assets/audio/wrongAns.mp3");
          // console.log("this.incorrectCount", this.incorrectCount);

          this.forCheking();
        }

      }
    }
    else {
      alert("Please select Ans:")
      // this.selectedArray.forEach(element => {
      //   console.log("this.filename == element.key", this.selectedArray, this.filename, this.filename == element.key)
      //   if (this.filename !== element.key) {
      //     let obj = {
      //       key: this.filename,
      //       value: this.selectedAns
      //     }
      //     this.selectedArray.push(obj);
      //     console.log(this.selectedArray)
      //   } else {
      //     this.selectedAns = element.value;
      //   }

      // });
    }
    
  }

  audioplay(file) {
    this.audioObj.src = file;
    this.audioObj.load();
    this.audioObj.play();
  }
  forCheking() {
    
    // let obj = {
    //   key: this.filename,
    //   value: this.selectedAns
    // }
    // this.selectedArray.push(obj);
    // console.log(this.selectedArray)
    
 this.selectedArray.forEach(element => {

        if (this.filename !== element.key) {
          let obj = {
            key: this.filename,
            value: this.selectedAns
          }
          this.selectedArray.push(obj);
          console.log(this.selectedArray)
        } else {
          this.selectedAns = element.value;
        }

      });

    this.currentScreencount = this.currentScreencount + 1;
    console.log(" currentScreencount", this.currentScreencount)
    if (this.currentScreencount < this.testJson.questions[this.testFilearr].items.length) {
        this.atteptCount = this.atteptCount + 1;
        this.updateNextque();
    } else {
      if (this.testFilearr < this.testJson.questions.length) {
        this.testFilearr = this.testFilearr + 1;
        this.currentScreencount = 0;
        if (this.testFilearr !== this.testJson.questions.length) {
          this.atteptCount = this.atteptCount + 1;
          this.updateNextque();
        } else {
          this.result();
        }
      }
     
    }
    this.selectedAns = "";
  }
  updateNextque()
  {
    if (this.testFilearr < this.testJson.questions.length) {
      this.filename = this.testJson.questions[this.testFilearr].items[this.currentScreencount];

      if (this.filename) {
        this.http.get('/assets/' + this.filename).subscribe(data => {
          this.quetion = data;
        });
      }
    }
  }

  result() {
    this.showResult = true;
    this.percentage = (this.correctCount / this.atteptCount) * 100;
    if (this.percentage > 50)
      this.status = "PASS";
    else
      this.status = "FAIL";
    console.log("RESULT:")
    console.log("Attepted:", this.atteptCount);
    console.log("CORRECT ANS:", this.correctCount);
    console.log("Percentage:", this.percentage);
  }
}
