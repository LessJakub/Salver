import { Component, OnInit } from '@angular/core';
import { TeamMember } from '../../models/TeamMember';

@Component({
  selector: 'app-team-page',
  templateUrl: './team-page.component.html',
  host: {'class': 'flex-auto flex flex-col justify-center items-center'} // ! Styling host container to fill all avialable space
})
export class TeamPageComponent implements OnInit {

    teamMembers: TeamMember[] = [
        // DB
        {name: "Mateusz Mnich", role: "Database"},
        {name: "Mateusz Kokot", role: "Database / Backend"},
        // Backend
        {name: "Jakub Leśniak", role: "Backend"},
        // Frontend
        {name: "Radosław Rzeczkowski", role: "Frontend"},
        {name: "Lucia Fonteriz", role: "Frontend"},
        {name: "Diego Suarez", role: "Frontend"},
        {name: "Gracjan Jeżewski", role: "Frontend"},
    ]

    shuffled: TeamMember[] = []
    
  constructor() { }

  ngOnInit(): void {
      this.shuffled = this.teamMembers.map(value => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value)
  }

}
