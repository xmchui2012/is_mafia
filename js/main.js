
$(document).ready(function() {       
        
    $(".navbar-toggle").click(function() {
        if ($(this).hasClass("toggled")) {
            $($(this).data("target")).css("display", "none");
            $(this).removeClass("toggled");
        } else {
            $($(this).data("target")).css("display", "block");
            $(this).addClass("toggled");
        }
    });

    $("#age-groups-container").draggable();
    $("#age-groups-container").css("cursor", "move");


    $("#age-groups").click(function() {
        $("#" + this.id + "-container").show();
    });

    //================SLIDER OPACITY CONTROL===============================
    $("#slide").change(function() {
        $("path.leaflet-clickable").css("opacity", $(this).val());
    });

    //================INITALISE MAP===============================
    var map = L.map('map', {
        zoomControl: true, maxZoom: 19
    }).fitBounds([[1.1379363227, 103.560519444], [1.53721940685, 104.129578999]]);

    var hash = new L.Hash(map);

    var additional_attrib = 'created w. <a href="https://github.com/geolicious/qgis2leaf" target ="_blank">qgis2leaf</a> by <a href="http://www.geolicious.de" target ="_blank">Geolicious</a> & contributors<br>';
    var feature_group = new L.featureGroup([]);
    var layer_group = new L.layerGroup([]);

    //================RENDER MAP BASE LAYERS===============================
    var basemap_0 = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: additional_attrib + '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors,<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
    });

    layer_group.addLayer(basemap_0);
    layer_group.addTo(map); // default base map

    var basemap_2 = L.tileLayer('http://a.tile.stamen.com/watercolor/{z}/{x}/{y}.png', {
        attribution: additional_attrib + 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data: &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors,<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
    });

    var basemap_3 = L.tileLayer('http://{s}.tile.thunderforest.com/transport/{z}/{x}/{y}.png', {
        attribution: additional_attrib + '&copy; <a href="http://www.opencyclemap.org">OpenCycleMap</a>, &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors,<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
    });
    //=======================ADD BASEMAP LAYERS=======================

    //===============RENDER ALL DATA LAYERS HERE==================================
    //================COLOUR CODES BASED ON POPULATION NUMBERS===================      
    function doStylePopdensity(feature) {
        if (feature.properties.total >= 0.0 && feature.properties.total <= 10.0) {
            return {
                color: '#c4c4c4',
                weight: '1.3',
                fillColor: '#f7fbff',
                opacity: '1.0',
                fillOpacity: '1.0',
            }
        }
        if (feature.properties.total >= 10.0 && feature.properties.total <= 5000.0) {
            return {
                color: '#c4c4c4',
                weight: '1.3',
                fillColor: '#d1e2f2',
                opacity: '1.0',
                fillOpacity: '1.0',
            }
        }
        if (feature.properties.total >= 5000.0 && feature.properties.total <= 15000.0) {
            return {
                color: '#c4c4c4',
                weight: '1.3',
                fillColor: '#9ac7e0',
                opacity: '1.0',
                fillOpacity: '1.0',
            }
        }
        if (feature.properties.total >= 15000.0 && feature.properties.total <= 30000.0) {
            return {
                color: '#c4c4c4',
                weight: '1.3',
                fillColor: '#519ccc',
                opacity: '1.0',
                fillOpacity: '1.0',
            }
        }

        if (feature.properties.total >= 30000.0 && feature.properties.total <= 80000.0) {
            return {
                color: '#c4c4c4',
                weight: '1.3',
                fillColor: '#08306b',
                opacity: '1.0',
                fillOpacity: '1.0',
            }
        }
    }

    //=================FOR RENDERING THE TOOLTIP UPON CLICKING ON AN MTZ ZONE ON THE HEATMAP======
    function popdensity(feature, layer) {
        var popupContent = feature.properties.html_exp;
        var name = popupContent.substring(popupContent.indexOf("<b>"), popupContent.indexOf("</b>"));
        var population = parseInt(popupContent.substring(popupContent.indexOf("</b>")).substring(popupContent.indexOf("<b>"), popupContent.indexOf("</b>")));
        layer.bindPopup("<h4>" + name + " Region</h4>" + "<br>Population Total: " + population);
    }


    //===================RENDER ALL POPULATION HEATMAP LAYERS HERE VIA GEOJSON AJAX===============
    var exp_2012popdensityJSON = new L.GeoJSON.AJAX("populationData/exp_2012popdensity.json", {
        onEachFeature: popdensity,
        style: doStylePopdensity
    });
    
     var exp_2012popdensityJSON = new L.GeoJSON.AJAX("populationData/exp_2012popdensity.json", {
        onEachFeature: popdensity,
        style: doStylePopdensity
    });
    
    var fgroup1 = 0; // under 5 years
    var fgroup2 = 0; // 5 to 13 Years
    var fgroup3 = 0; // 14 to 17 Years
    var fgroup4 = 0; // 18 to 24 Years
    var fgroup5 = 0; // 25 to 44 Years
    var fgroup6 = 0; // 45 to 64 Years
    var fgroup7 = 0; // 65 Years and Over

    var mgroup1 = 0; // under 5 years
    var mgroup2 = 0; // 5 to 13 Years
    var mgroup3 = 0; // 14 to 17 Years
    var mgroup4 = 0; // 18 to 24 Years
    var mgroup5 = 0; // 25 to 44 Years
    var mgroup6 = 0; // 45 to 64 Years
    var mgroup7 = 0; // 65 Years and Over


    function populateDemographics() {
        $.getJSON("populationData/exp_2012popdensity.json", function(data) {
            $.each(data["features"], function(i) {
                var record = data["features"][i]["properties"];
                $.each(record, function(key, value) {

                    var matches = String(key).match(/\d+/g);

                    if (String(key).indexOf("female") != -1) {
                        if (matches != null && String(key).indexOf("OBJECT") == -1) {
                            if (parseInt(matches) < 5) {
                                fgroup1 += value;
                            } else if (parseInt(matches) <= 13) {
                                fgroup2 += value;
                            } else if (parseInt(matches) <= 17) {
                                fgroup3 += value;
                            } else if (parseInt(matches) <= 24) {
                                fgroup4 += value;
                            } else if (parseInt(matches) <= 44) {
                                fgroup5 += value;
                            } else if (parseInt(matches) <= 64) {
                                fgroup6 += value;
                            } else {
                                fgroup7 += value;
                            }
                        }
                    }

                    if (String(key).indexOf("male") != -1) {
                        if (matches != null && String(key).indexOf("OBJECT") == -1) {
                            if (parseInt(matches) < 5) {
                                mgroup1 += value;
                            } else if (parseInt(matches) <= 13) {
                                mgroup2 += value;
                            } else if (parseInt(matches) <= 17) {
                                mgroup3 += value;
                            } else if (parseInt(matches) <= 24) {
                                mgroup4 += value;
                            } else if (parseInt(matches) <= 44) {
                                mgroup5 += value;
                            } else if (parseInt(matches) <= 64) {
                                mgroup6 += value;
                            } else {
                                mgroup7 += value;
                            }
                        }
                    }

                });
            });
        });
    }

    populateDemographics();

    //====================ADD TOOLTIP FOR MRT LINES RENDERED==================================
    function pop_MRTlinesall(feature, layer) {
        var popupContent = '<table><tr><td><h4>' + Autolinker.link(String(feature.properties['LEVEL_'])) + '</h4></td></tr></table>';
        layer.bindPopup(popupContent);
    }

    //====================STYLE THE MRT LINE COLOURS AND OTHER PROPERTIES=====================
    function doStyleMRTlinesall(feature) {
        switch (feature.properties.LEVEL_) {
            case 'CIRCLE LINE':
                return {
                    color: '#e5ca15',
                    weight: '3.3',
                    dashArray: '',
                    opacity: '1.0',
                };
                break;
            case 'DOWNTOWN LINE':
                return {
                    color: '#335ed6',
                    weight: '3.3',
                    dashArray: '',
                    opacity: '1.0',
                };
                break;
            case 'EAST WEST LINE':
                return {
                    color: '#33a02c',
                    weight: '3.3',
                    dashArray: '',
                    opacity: '1.0',
                };
                break;
            case 'NORTH EAST LINE':
                return {
                    color: '#ab28ad',
                    weight: '3.3',
                    dashArray: '',
                    opacity: '1.0',
                };
                break;
            case 'NORTH SOUTH LINE':
                return {
                    color: '#e31a1c',
                    weight: '3.3',
                    dashArray: '',
                    opacity: '1.0',
                };
                break;
            default:
                return {
                    color: '#335ed6',
                    weight: '1.3',
                    dashArray: '',
                    opacity: '1.0',
                };
                break;
        }
    }

    //======================RENDER THE MRT LINES MAP LAYER=====================================
    var exp_MRTlinesallJSON = new L.geoJson(exp_MRTlinesall, {
        onEachFeature: pop_MRTlinesall,
        style: doStyleMRTlinesall
    });

    //=======================ADD TOOLTIP TO MRT POINTS ON THE MAP========================================
    function pop_MRTpoints(feature, layer) {
        var stationNo = Autolinker.link(String(feature.properties['STN_NO']));

        var newStationNo = "";

        for (var i = 0; i < stationNo.length; i++) {
            if (stationNo[i] != ' ') {
                newStationNo += stationNo[i];
            }
        }

        var popupContent = '<table><tr><td style="text-align:center"><h4>' + Autolinker.link(String(feature.properties['BUILDING_N'])) + '</h4><h5>' + newStationNo + '</h5></td></table>';
        layer.bindPopup(popupContent);
    }

    //=======================RENDER MAP LAYER WITH MRT POINTS========================================
    var exp_MRTpointsJSON = new L.geoJson(exp_MRTpoints, {
        onEachFeature: pop_MRTpoints,
        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng, {
                radius: 6,
                fillColor: '#ffffff',
                color: '#000000',
                weight: 1,
                opacity: 1.0,
                fillOpacity: 1.0
            })
        }
    });

    //===============ADD POPULATION HEATMAP LEGEND TO MAP=========================================
    var legend = L.control({position: 'bottomright'});
    legend.onAdd = function(map) {
        var div = L.DomUtil.create('div', 'info legend');
        div.innerHTML = "<b>Population Count</b><div class='row'><div class='col-md-2'><div class='legend-symbol' style='background-color:#f7fbff;'></div><br><span style='margin-left:20px;'>0&nbsp;to&nbsp;10</span></div><div class='col-md-2'><div class='legend-symbol' style='background-color:#d1e2f2;'></div><br><span style='margin-left:20px;'>10&nbsp;to&nbsp;5000</span></div><div class='col-md-2'><div class='legend-symbol' style='background-color:#9ac7e0;'></div><br><span style='margin-left:20px;'>5000&nbsp;to&nbsp;15000</span></div><div class='col-md-2'><div class='legend-symbol' style='background-color:#519ccc;'></div><br><span style='margin-left:20px;'>15000&nbsp;&nbsp;to&nbsp;30000</div><div class='col-md-4'><div class='legend-symbol' style='background-color:#08306b;'></div><br><span style='margin-left:20px;'>30000&nbsp;to&nbsp;80000</span></div></div><b>MRT Lines</b><div class='row'><div class='col-md-2'><div class='legend-symbol' style='background-color:#e5ca15;'></div><br><span style='margin-left:20px;'>Circle&nbsp;Line</span></div><div class='col-md-2'><div class='legend-symbol' style='background-color:#335ed6;'></div><br><span style='margin-left:20px;'>Downtown&nbsp;Line</span></div><div class='col-md-2'><div class='legend-symbol' style='background-color:#33a02c;'></div><br><span style='margin-left:20px;'>East&nbsp;West&nbsp;Line</span></div><div class='col-md-2'><div class='legend-symbol' style='background-color:#e31a1c;'></div><br><span style='margin-left:20px;'>North&nbsp;East&nbsp;Line</div><div class='col-md-2'><div class='legend-symbol' style='background-color:#ab28ad;'></div><br><span style='margin-left:20px;'>North&nbsp;West&nbsp;Line</span></div></div>";

        return div;
    };
    legend.addTo(map);

    L.control.scale({options: {position: 'bottomleft', maxWidth: 100, metric: true, imperial: false, updateWhenIdle: false}}).addTo(map);

    feature_group.addLayer(exp_2012popdensityJSON);
    feature_group.addLayer(exp_MRTlinesallJSON);
    feature_group.addLayer(exp_MRTpointsJSON);

    feature_group.addTo(map);

    //===============================FORMAT THE MRT POINTS VIA JQUERY=================================================
    $(".leaflet-clickable").each(function() {
        if ($(this).attr("stroke") == "#000000") { // mrt points
            $(this).attr("stroke-width", "3");
        }
    });

    //===============================WHEN AN MRT LINE IS MOUSED OVER IT BECOME THICKER==================
    $(".leaflet-clickable").mouseover(function() {
        var stroke = $(this).attr("stroke");

        if ($(this).attr("stroke") != "#000000" && $(this).attr("fill") != "#ffffff") { // mrt lines
            $(".leaflet-clickable").each(function() {
                if ($(this).attr("stroke") == stroke) {
                    $(this).attr("stroke-width", "7");
                }
            });
        } else {
            $(this).attr("fill", "red");
        }
    });

    //===============================WHEN AN MRT LINE IS MOUSED OUT IT BECOME ITS ORIGINAL THICKNESS==================
    $(".leaflet-clickable").mouseout(function() {
        var stroke = $(this).attr("stroke");

        if ($(this).attr("stroke") != "#000000" && $(this).attr("fill") != "#ffffff") { // mrt lines
            $(".leaflet-clickable").each(function() {
                if ($(this).attr("stroke") == stroke) {
                    $(this).attr("stroke-width", "3.3");
                }
            });
        } else {
            $(this).attr("fill", "#ffffff");
        }
    });
    
    
    
    //=================================TOGGLE VISIBILITY OF POPULATION MAP==================
    $("#control-pop-map").click(function() {
        if (document.getElementById("control-pop-map").checked == true) {
            feature_group.addLayer(exp_2012popdensityJSON);
            feature_group.addTo(map);
        } else {
            feature_group.removeLayer(exp_2012popdensityJSON);
        }
    });
    
    
    //============================TOGGLE VISIBILITY OF MRT MAP==============================       
    $("#control-mrt-map").click(function() {
        if (document.getElementById("control-mrt-map").checked == true) {
            feature_group.addLayer(exp_MRTlinesallJSON);
            feature_group.addLayer(exp_MRTpointsJSON);
            feature_group.addTo(map);
        } else {
            feature_group.removeLayer(exp_MRTlinesallJSON);
            feature_group.removeLayer(exp_MRTpointsJSON);
        }
    });
    
    
    //=======================TOGGLE VISIBILITY OF LEGEND====================================
    $("#control-legend").click(function() {
        if (document.getElementById("control-legend").checked == true) {
            $(".info.legend").show();
        } else {
            $(".info.legend").hide();
        }
    });
    
    
    //========================TOGGLE VISIBILITY OF BASE MAPS================================
    $("#base0").click(function() {
        layer_group.removeLayer(basemap_2);
        layer_group.removeLayer(basemap_3);
        layer_group.addLayer(basemap_0);
    });

    $("#base1").click(function() {
        layer_group.removeLayer(basemap_0);
        layer_group.removeLayer(basemap_3);
        layer_group.addLayer(basemap_2);
    });

    $("#base2").click(function() {
        layer_group.removeLayer(basemap_2);
        layer_group.removeLayer(basemap_0);
        layer_group.addLayer(basemap_3);
    });
    
    
    //==================================TOGGLE VISIBILITY OF GRAPHS==========================
    $("#close-age-groups").click(function() {
        $("#age-groups-container").hide();
    });

    $("#age-groups").click(function() {
        $("#dashboard").html("");

        function dashboard(id, fData) {
            var barColor = 'steelblue';
            function segColor(c) {
                return {Female: "pink", Male: "lightblue"}[c];
            }

            // compute total for each state.
            fData.forEach(function(d) {
                d.total = d.freq.Female + d.freq.Male;
            });

            // function to handle histogram.
            function histoGram(fD) {
                var hG = {}, hGDim = {t: 60, r: 0, b: 30, l: 0};
                hGDim.w = 700 - hGDim.l - hGDim.r,
                        hGDim.h = 300 - hGDim.t - hGDim.b;

                //create svg for histogram.
                var hGsvg = d3.select(id).append("svg")
                        .attr("width", hGDim.w + hGDim.l + hGDim.r)
                        .attr("height", hGDim.h + hGDim.t + hGDim.b).append("g")
                        .attr("transform", "translate(" + hGDim.l + "," + hGDim.t + ")");

                // create function for x-axis mapping.
                var x = d3.scale.ordinal().rangeRoundBands([0, hGDim.w], 0.1)
                        .domain(fD.map(function(d) {
                            return d[0];
                        }));

                // Add x-axis to the histogram svg.
                hGsvg.append("g").attr("class", "x axis")
                        .attr("transform", "translate(0," + hGDim.h + ")")
                        .call(d3.svg.axis().scale(x).orient("bottom"));

                // Create function for y-axis map.
                var y = d3.scale.linear().range([hGDim.h, 0])
                        .domain([0, d3.max(fD, function(d) {
                                return d[1];
                            })]);

                // Create bars for histogram to contain rectangles and freq labels.
                var bars = hGsvg.selectAll(".bar").data(fD).enter()
                        .append("g").attr("class", "bar");

                //create the rectangles.
                bars.append("rect")
                        .attr("x", function(d) {
                            return x(d[0]);
                        })
                        .attr("y", function(d) {
                            return y(d[1]);
                        })
                        .attr("width", x.rangeBand())
                        .attr("height", function(d) {
                            return hGDim.h - y(d[1]);
                        })
                        .attr('fill', barColor)
                        .on("mouseover", mouseover)// mouseover is defined below.
                        .on("mouseout", mouseout);// mouseout is defined below.

                //Create the frequency labels above the rectangles.
                bars.append("text").text(function(d) {
                    return d3.format(",")(d[1])
                })
                        .attr("x", function(d) {
                            return x(d[0]) + x.rangeBand() / 2;
                        })
                        .attr("y", function(d) {
                            return y(d[1]) - 5;
                        })
                        .attr("text-anchor", "middle");

                function mouseover(d) {  // utility function to be called on mouseover.
                    // filter for selected state.
                    var st = fData.filter(function(s) {
                        return s.State == d[0];
                    })[0],
                            nD = d3.keys(st.freq).map(function(s) {
                        return {type: s, freq: st.freq[s]};
                    });

                    // call update functions of pie-chart and legend.    
                    pC.update(nD);
                    leg.update(nD);
                }

                function mouseout(d) {    // utility function to be called on mouseout.
                    // reset the pie-chart and legend.    
                    pC.update(tF);
                    leg.update(tF);
                }

                // create function to update the bars. This will be used by pie-chart.
                hG.update = function(nD, color) {
                    // update the domain of the y-axis map to reflect change in frequencies.
                    y.domain([0, d3.max(nD, function(d) {
                            return d[1];
                        })]);

                    // Attach the new data to the bars.
                    var bars = hGsvg.selectAll(".bar").data(nD);

                    // transition the height and color of rectangles.
                    bars.select("rect").transition().duration(500)
                            .attr("y", function(d) {
                                return y(d[1]);
                            })
                            .attr("height", function(d) {
                                return hGDim.h - y(d[1]);
                            })
                            .attr("fill", color);

                    // transition the frequency labels location and change value.
                    bars.select("text").transition().duration(500)
                            .text(function(d) {
                                return d3.format(",")(d[1])
                            })
                            .attr("y", function(d) {
                                return y(d[1]) - 5;
                            });
                }
                return hG;
            }

            // function to handle pieChart.
            function pieChart(pD) {
                var pC = {}, pieDim = {w: 250, h: 250};
                pieDim.r = Math.min(pieDim.w, pieDim.h) / 2;

                // create svg for pie chart.
                var piesvg = d3.select(id).append("svg")
                        .attr("width", pieDim.w).attr("height", pieDim.h).append("g")
                        .attr("transform", "translate(" + pieDim.w / 2 + "," + pieDim.h / 2 + ")");

                // create function to draw the arcs of the pie slices.
                var arc = d3.svg.arc().outerRadius(pieDim.r - 10).innerRadius(0);

                // create a function to compute the pie slice angles.
                var pie = d3.layout.pie().sort(null).value(function(d) {
                    return d.freq;
                });

                // Draw the pie slices.
                piesvg.selectAll("path").data(pie(pD)).enter().append("path").attr("d", arc)
                        .each(function(d) {
                            this._current = d;
                        })
                        .style("fill", function(d) {
                            return segColor(d.data.type);
                        })
                        .on("mouseover", mouseover).on("mouseout", mouseout);

                // create function to update pie-chart. This will be used by histogram.
                pC.update = function(nD) {
                    piesvg.selectAll("path").data(pie(nD)).transition().duration(500)
                            .attrTween("d", arcTween);
                }
                // Utility function to be called on mouseover a pie slice.
                function mouseover(d) {
                    // call the update function of histogram with new data.
                    hG.update(fData.map(function(v) {
                        return [v.State, v.freq[d.data.type]];
                    }), segColor(d.data.type));
                }
                //Utility function to be called on mouseout a pie slice.
                function mouseout(d) {
                    // call the update function of histogram with all data.
                    hG.update(fData.map(function(v) {
                        return [v.State, v.total];
                    }), barColor);
                }
                // Animating the pie-slice requiring a custom function which specifies
                // how the intermediate paths should be drawn.
                function arcTween(a) {
                    var i = d3.interpolate(this._current, a);
                    this._current = i(0);
                    return function(t) {
                        return arc(i(t));
                    };
                }
                return pC;
            }

            // function to handle legend.
            function legend(lD) {
                var leg = {};

                // create table for legend.
                var legend = d3.select(id).append("table").attr('class', 'legend');

                // create one row per segment.
                var tr = legend.append("tbody").selectAll("tr").data(lD).enter().append("tr");

                // create the first column for each segment.
                tr.append("td").append("svg").attr("width", '16').attr("height", '16').append("rect")
                        .attr("width", '16').attr("height", '16')
                        .attr("fill", function(d) {
                            return segColor(d.type);
                        });

                // create the second column for each segment.
                tr.append("td").text(function(d) {
                    return d.type;
                });

                // create the third column for each segment.
                tr.append("td").attr("class", 'legendFreq')
                        .text(function(d) {
                            return d3.format(",")(d.freq);
                        });

                // create the fourth column for each segment.
                tr.append("td").attr("class", 'legendPerc')
                        .text(function(d) {
                            return getLegend(d, lD);
                        });

                // Utility function to be used to update the legend.
                leg.update = function(nD) {
                    // update the data attached to the row elements.
                    var l = legend.select("tbody").selectAll("tr").data(nD);

                    // update the frequencies.
                    l.select(".legendFreq").text(function(d) {
                        return d3.format(",")(d.freq);
                    });

                    // update the percentage column.
                    l.select(".legendPerc").text(function(d) {
                        return getLegend(d, nD);
                    });
                }

                function getLegend(d, aD) { // Utility function to compute percentage.
                    return d3.format("%")(d.freq / d3.sum(aD.map(function(v) {
                        return v.freq;
                    })));
                }

                return leg;
            }

            // calculate total frequency by segment for all state.
            var tF = ['Female', 'Male'].map(function(d) {
                return {type: d, freq: d3.sum(fData.map(function(t) {
                        return t.freq[d];
                    }))};
            });

            // calculate total frequency by state for all segment.
            var sF = fData.map(function(d) {
                return [d.State, d.total];
            });

            var hG = histoGram(sF), // create the histogram.
                    pC = pieChart(tF), // create the pie-chart.
                    leg = legend(tF);  // create the legend.
        }

        var freqData = [
            {State: 'Under 5 years', freq: {Female: fgroup1, Male: mgroup1}}
            , {State: '5 to 13 Years', freq: {Female: fgroup2, Male: mgroup2}}
            , {State: '14 to 17 Years', freq: {Female: fgroup3, Male: mgroup3}}
            , {State: '18 to 24 Years', freq: {Female: fgroup4, Male: mgroup4}}
            , {State: '25 to 44 Years', freq: {Female: fgroup5, Male: mgroup5}}
            , {State: '45 to 64 Years', freq: {Female: fgroup6, Male: mgroup6}}
            , {State: '65 Years and Over', freq: {Female: fgroup7, Male: mgroup7}}
        ];

        dashboard('#dashboard', freqData);
    });



}); // end document ready function
