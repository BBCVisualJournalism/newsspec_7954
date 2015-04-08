# Newsspec-7954

## Commonwealth Games Calculator

The Commonwealth Games Calculator takes a number of inputs and returns the sports that you are most (and least!) suited to.

The user rates themselves from 1-10 for a number of attributes, e.g. aggression, agility etc. We have a table of sports which lists the ideal range for each attribute, e.g. 'athletics' might have an ideal coordination rating of 3-6.

If the user falls within that range, nothing is added to their score for that sport, whereas if the user falls outside the range (e.g. their coordination is 9) they are deemed less suited to the sport and would have 9-6 = 3 added to their score for that sport.

A score is calculated against each sport's ideal characteristics, then the calculator returns the top sports (the sports with the LOWEST scores) and the bottom sports.

## Application structure 

The application is split into two screens - the "Inputs view" and the "Results view".

The Inputs view is further split into two screens - the "Questions view" and the "Sidebar view" (desktop only).

Each of these views has a corresponding JS module, e.g. `View_Inputs.js`, `View_Inputs__Sidebar.js`, etc.

### HTML structure

* `tmpl/container__inputs.tmpl` contains the markup for the inputs view
* `tmpl/container__results.tmpl` contains the markup for the results view

`index.html.tmpl` pulls in these two views, as well as some other files required by the application:

* `tmpl/vocabs_sports.tmpl` - contains JSON representing the vocabs information for each sport, used to populate the results view
* `tmpl/vocabs_scaffolding.tmpl` - contains JSON representing the vocabs information for dynamically generated parts of the project, e.g. sharetools variables
* `tmpl/templates.tmpl` - this contains a number of "micro-templates" which are used by the application itself at runtime. It means we can dynamically change the HTML in the application without hardcoding HTML inside the JavaScript itself. The JavaScript instead uses `js/CustomTemplateEngine.js` to take a template, interpolate values and output HTML.

### JavaScript structure

`app.js` pulls in `Calculator.js`, which is responsible for switching between the Inputs and Results views. It also pulls in the non-core JS, e.g. `iStatsController.js` and `CustomEvents.js`. Every single pubsub event in the application is defined in `CustomEvents.js`, with the exception of 'question:selected' (fired from `QuestionsModel.js`). We listen for these pubsubs in `iStatsController.js` and define all of our iStats calls there.

#### Inputs View

`View_Inputs.js` defines the Inputs view, pulling in `View_Inputs__Questions.js` and `View_Inputs__Sidebar.js`.

`View_Inputs__Questions.js` is responsible for how the questions render. `QuestionsModel.js` is responsible for actually grabbing the user inputs and returning this as JSON for the graph component.

`View_Inputs__Sidebar.js` defines how the sidebar repositions itself on scroll, and pulls in `GraphComponent.js` for the visualisation it contains.

`GraphComponent.js` is populated with a model (QuestionsModel, but this could easily be CalculatorModel if required), which generates a bar chart by default, or pulls in d3 to make a nice SVG chart if the browser supports it.

#### Results View

`View__Results.js` defines the results view. It mainly grabs templates from tmpl/templates.tmpl and converts them to HTML, but it also pulls in `GraphComponent`. Calling `graph.init` from the Sidebar or from the Results view moves the graph in the DOM - it is the *same graph* in both views. Additional arguments can be passed into the init method, which lets you swap the central icon, etc.

## Data

### How and where is the data used?

I've made a `copy_data` grunt task which copies the JSON files into the appropriate places, as well in packaging them as AMD modules.

The application data into `/source/js/data/data.js` for use in the application itself.

The test data is copied into `/source/js/spec/data/testData.js` for use in the Jasmine unit tests.

### Generating the data

Install RStudio and run the two R scripts in `/source/data/`. You may need to install some packages first.

Running the R script generates two sets of data:

#### Application data

Location: `/source/data/processed/data.json`

Contains the list of sports and their ideal properties (i.e. if user puts in same values they should match to that sport)

#### Test data

Location: `/source/data/processed/testdata/`

There are several JSON files here, where the inputs are represented by the name of the file, and the outputs are the contents of the file.

## iFrame scaffold

This project was built using the iFrame scaffold v1.4.1

## License
Copyright (c) 2014 BBC