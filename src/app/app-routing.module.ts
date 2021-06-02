import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { QuizquestionsComponent } from './components/quizquestions/quizquestions.component';

const routes: Routes = [
  { path: "quiz", component: QuizquestionsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
