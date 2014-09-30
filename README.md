bonita-angular-dashboard-selfcontain
====================================

**Bonita BPM Dashboard built on AngularJS and integrated as a SPA (Single Page Application).**
Based on Philippe Ozil (Bonitasoft) original work (that was based on Fabio Lombardi's (Bonitasoft) original work) 

This pages uses ngBonita (a non-official Bonita REST API client for AngularJS):
[ngBonita GitHub project](https://github.com/rodriguelegall/ngBonita)

**Note:** this is just a demo to show how to integrate ngBonita.


## How to build the project

1. get the source
2. npm install
3. bower install
4. grunt serve:http\://PATH_TO_BONITA\:PORT/bonita
5. access your localhost:9000

The param added to grunt serve is the destination for proxy, it allow developper to use this demo on a different domain without configuring CORS.

## TODO

1. To have something pretty to look at =)
2. Manage a logout feature
3. Create real independant directives
4. Deploy ngBonita on bower so that it can be define as a bower dependency
5. Have a task to deploy the final 'custom page', ready to be imported into Bonita

## Why this project

Pozil's demo (https://github.com/pozil/bonita-angular-dashboard) has some culprit :

1. it is a 'custom page' project, so that it needs advanced Bonita feature that may not be available to anyone that want to try it
2. it doesn't not use Grunt process workflow
3. it doesn't use bower for front end dependencies management
4. I'd really like to have self contained directives
5. Boostrap is customizable through less (you'll find a variable file that will override Bootstrap default properties : app/less/_overriden_variables.less)
6. Login is managed through a mandatory step ; the dashboard is only accessible after going through the login screen