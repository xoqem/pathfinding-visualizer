# Pathfinding Visualizer

This project was created to support a paper that I wrote for CS 681 Applications of Computability at Ball State University. That goal is to complete a comparative analysis of a selection of pathfinding algorithms.

## Features

### Environment Creation

The polygons panel allows creating an environment to be navigated. This can be loaded from a couple of sample SVG files that are provided, or created randomly.

### Search Space Representation

The graph panel allows creating different kinds of graphs to cover the environment to be used with pathfinding algorithms.

### Pathfinding Algorithms

The path panel allows running different pathfinding algorithms on the graph that was created in the graph panel.

### Settings

In the settings panel animation can be turned on for the graph or path creation, to allow better visual understanding of how each of these works. Additionally, dark mode can be toggled on or off.

In th panel below the environment map, the transparency of different layers on the map can be controlled to more easily see different aspects of the space.

### Test Runs

If the experiment icon is clicked a test run panel is shown. The test panel allows running between 1 and 100 test runs. The table on the table tab allows paging through each test run, seeing statistics for the run, and clicking the algorithm name to visualize that specific scenario. The plots tab visualizes the results of all the test runs combined in a box plot for different metrics, as well as providing statistical information about each of these metrics. The data used to create the charts on the plots tab can be exported to a local file.

## Running the application

The application was created with Vite, so the typical commands function, like `npm run dev` for building locally or `npm run build` to create a build to be deployed.

## Acknowledgements

The following libraries, and many others I'm sure, were instrumental in building this app:
- Biomejs for linting and prettying the code
- Chakra-ui for UI components
- Pixi JS for visualizing the environment, graph, and pathfinding results.
- Flatqueue for providing a priority queue
- Lodash for util functions
- Mathjs for statistical functions
- Plotly JS for creating box plots
- React for the overall framework of the application
- React-icons for the icons in the application
- Vite for creating the initial application setup

And of course Ball State University faculty and staff, especially Dr. Jay Bagga, for the inspiration!
