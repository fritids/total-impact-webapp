function Genre(e){this.name=e;this.items=[];this.render=function(){var e=$(ich.genreTemplate({name:this.name},!0)),t=[],n=[];for(var r=0;r<this.items.length;r++){var i=this.items[r];i.hasAwards()?t.push(i.render()):n.push(i.render())}e.find("ul.items.active").append(t);e.find("ul.items.inactive").append(n);n.length?e.find("h4.plus-more span.value").html(n.length):e.find("h4.plus-more").hide();return e};return!0}function GenreList(e){this.genres={};for(var t=0;t<e.length;t++){var n=e[t].dict.biblio.genre;this.genres[n]||(this.genres[n]=new Genre(n));this.genres[n].items.push(e[t])}this.render=function(){var e=[];for(var t in this.genres){var n=this.genres[t].render();e.push(n)}$("div.genre").remove();$("div.tooltip").remove();$("#metrics div.wrapper").append(e)}}function Coll(e,t){this.views=e;this.user=t;this.id=null;this.items={};this.addItems=function(e){for(var t=0;t<e.length;t++){tiid=e[t]._id;this.items[tiid]=new Item(e[t],new ItemView)}};this.update=function(){var e=this;this.views.startUpdating();$.ajax({url:"http://"+api_root+"/collection/"+this.id,type:"POST",success:function(t){console.log("updating.");e.get(1e3)}})};this.get=function(e){var t=this;this.views.startUpdating();$.ajax({url:"http://"+api_root+"/collection/"+t.id,type:"GET",dataType:"json",contentType:"application/json; charset=utf-8",statusCode:{210:function(n){console.log("still updating");t.addItems(n.items);t.views.render(t.items);setTimeout(function(){t.get(e)},500)},200:function(e){console.log("done with updating");t.addItems(e.items);t.views.render(t.items);t.views.finishUpdating(e.items);return!1}}})}}function CollViews(){this.startUpdating=function(){$("img.loading").remove();$("h2").before(ajaxLoadImgTransparent)};this.badgesWeight=function(e){var t=0;t+=e.awards.big.length*10;t+=e.awards.any.length*1;return t};this.finishUpdating=function(e){$("#page-header img").remove();$("#num-items span.value").text(e.length);$("li.item div.item-header").addClass("zoomable");$("span.item-expand-button").show().css({color:tiLinkColor}).fadeOut(1500,function(){$(this).removeAttr("style")})};this.render=function(e){var t=this,n=[];for(tiid in e)n.push(e[tiid]);n.sort(function(e,n){return t.badgesWeight(n.dict)-t.badgesWeight(e.dict)});var r=new GenreList(n);r.render()}}function CollController(e,t){if(typeof collectionId!="undefined"){e.id=collectionId;e.get(1e3)}$("#update-report-button").click(function(){e.update();return!1});$("div.btn-group.download button").click(function(){location.href=$(this).val()});$("div#num-items a").toggle(function(){$(this).html("(collapse all)");$("li.item").addClass("zoomed").find("div.zoom").show()},function(){$(this).html("(expand all)");$("li.item").removeClass("zoomed").find("div.zoom").hide()})};