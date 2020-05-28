export default {
  content: function(tooltipModel, vm) {
    //console.log(tooltipModel);
    // Tooltip Element
    var tooltipEl = document.getElementById("chartjs-tooltip");

    // Create element on first render
    if (!tooltipEl) {
      tooltipEl = document.createElement("div");
      tooltipEl.id = "chartjs-tooltip";
      tooltipEl.innerHTML = "<table></table>";
      document.body.appendChild(tooltipEl);
    }

    // Hide if no tooltip
    if (tooltipModel.opacity === 0) {
      tooltipEl.style.opacity = 0;
      return;
    }

    // Set caret Position
    tooltipEl.classList.remove("above", "below", "no-transform");
    if (tooltipModel.yAlign) {
      tooltipEl.classList.add(tooltipModel.yAlign);
    } else {
      tooltipEl.classList.add("no-transform");
    }

    function getBody(bodyItem) {
      return bodyItem.lines;
    }

    // Set Text
    if (tooltipModel.body) {
      var titleLines = tooltipModel.title || [];
      var bodyLines = tooltipModel.body.map(getBody);

      var innerHtml = "<thead>";

      titleLines.forEach(function(title) {
        innerHtml += "<tr><th>" + title + "</th></tr>";
      });
      innerHtml += "</thead><tbody>";

      bodyLines.forEach(function(body, i) {
        var content = body[0].replace(/\}\:.*$/, "}");
        content = JSON.parse(content);
        if (content.val == 0) return (innerHtml = "");
        var colors = tooltipModel.labelColors[i];
        var style = "background:" + colors.backgroundColor;
        style += "; border-color:" + colors.borderColor;
        style += "; border-width: 2px";
        var span = '<span style="' + style + '"></span>';
        innerHtml += `<tr><td>
                <div class="m-1">
                  <span style="background-color: ${
                    content.color
                  }" class="legend-color inline mr-1  legend-${
          content.toneid
        }"></span> 
                  <span class="legend-text m-0" style="color: ${
                    content.color
                  };">${content.tone} ${Math.floor(content.val * 100)}%</span>
                </div>
                <div>${content.tweet}</div>
                </td></tr>`;
      });
      innerHtml += "</tbody>";

      var tableRoot = tooltipEl.querySelector("table");
      tableRoot.innerHTML = innerHtml;
    }

    // `this` will be the overall tooltip
    var position = vm._chart.canvas.getBoundingClientRect();

    // Display, position, and set styles for font
    tooltipEl.style.opacity = 1;
    tooltipEl.style.position = "absolute";
    tooltipEl.style.left =
      position.left + window.pageXOffset + tooltipModel.caretX + "px";
    tooltipEl.style.top =
      position.top + window.pageYOffset + tooltipModel.caretY + "px";
  }
};