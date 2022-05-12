(function() {
  d3.force_labels = function force_labels() {
    // Created a paused simulation
    const linkForce = d3.forceLink()
        .links([])
        .distance(0);
    const chargeForce = d3.forceManyBody()
        .strength(-60)
        .theta(0.8);
    // also known as 'gravity' in d3v`3
    const centerForce = d3.forceCenter(w/2, h/2)
        .strength(0);
    const sim = d3.forceSimulation()
      .force("link", linkForce)
      .force("charge", chargeForce)
      .force("center", centerForce)
      .stop();
      
    // Update the position of the anchor based on the center of bounding box
    function updateAnchor() {
      if (!sim.selection.nodes().length)
        return;
      sim.selection.each(function(d) {
        var bbox = this.getBBox(),
            x = bbox.x + bbox.width / 2,
            y = bbox.y + bbox.height / 2;

        d.anchorPos.x = x;
        d.anchorPos.y = y;
       
        // If a label position does not exist, set it to be the anchor position 
        if (d.labelPos.x == null) {
          d.labelPos.x = x;
          d.labelPos.y = y;
        }
      });
    }
    
    //The anchor position should be updated on each tick
    sim.on("tick.labels", updateAnchor);
    
    // This updates all nodes/links - retaining any previous labelPos on updated nodes
    sim.update = function(selection) {
      sim.selection = selection;
      var nodes = [],
        links = [];
      selection.nodes().forEach(function(d) {    
        if(d && d.__data__) {
          var data = d.__data__;
          
          if (!d.labelPos)
            d.labelPos = {fixed: false};
          if (!d.anchorPos)
            d.anchorPos = {fixed: true};
          
          // Place position objects in __data__ to make them available through 
          // d.labelPos/d.anchorPos for different elements
          data.labelPos = d.labelPos;
          data.anchorPos = d.anchorPos;
          
          
          links.push({
            target: d.anchorPos,
            source: d.labelPos,
          });
          nodes.push(d.anchorPos);
          nodes.push(d.labelPos);
        }
      });
      sim
          .stop()
          .nodes(nodes)
          .force("link")
              .links(links)
              .distance(0);
      updateAnchor();
      sim
        .alpha(0.1)
        .restart();
      console.log(`alphaTarget: ${sim.alphaTarget()}\nalpha: ${sim.alpha()}`) 
    };
    return sim;
  };
})();