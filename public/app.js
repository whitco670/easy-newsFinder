



$.getJSON("/articles", function(data) {
	//db.cycleNews1.drop();
	//$("#articles").empty();
 	for (let i = 0; i < data.length; i++) {
  		$("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + "<a href='" + data[i].link + "'>Cycle to the Link</a></p>");
  	//$("#articles").append(`<p data-id=${data[i]._id}>${data[i].title}<br /> <a href= ${data[i.link]} >Cycle to the Link</a</p>`);
 }
});



$(document).on("click","p", function(){
	$("#notes").empty();
	var thisId = $(this).attr("data-id");
	console.log("This is the data id "+ thisId)

$.ajax({
	method: "GET",
	url: "/articles/" + thisId
})	

.then(function(data){
	console.log(data);
	$("#notes").append("<h2>" + data.title + "</h2>");
	$("#notes").append("<input id='titleinput' name='title'>");
	$("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
	$("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button");

	if (data.note){
		$("#titleinput").val(data.note.title);
		$("#bodyinput").val(data.note.body);
	}
});
});

$(document).on("click","#savenote", function(){
	var thisId = $(this).attr("data-id");
	console.log(thisId);
	$.ajax({
		method: "POST",
		url: "/articles/" + thisId,
		data:{
			title: $("#titleinput").val(),
			body: $("#bodyinput").val()
		}
	})
	.then(function(data){
		console.log(data);
		$("#notes").empty();
	});

	$("#titleinput").val("");
	$("#bodyinput").val("");

});



