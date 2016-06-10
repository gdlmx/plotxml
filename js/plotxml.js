plotxml = {
	plot : function(){
		$('.plotxml-fig2').each(function(){
			var lines = $(this).children('.plotxml-line').map(function(){
				var lineobj = {};
				$(this).children('.plotxml-para').each(function(){
					plotxml.fill_para(lineobj, $(this));
				})
				return lineobj;
			}).get();
			
			// layout
			var layout = {title:'2D Figure'};
			$(this).children('.plotxml-para').each(function(){
				plotxml.fill_para(layout, $(this));
			});
			// call plotly
			Plotly.newPlot($(this).find('.plotxml-canvas')[0], lines, layout);
		})
	},
	
	resolve : function(name, type, para){
		var blob = para.text().trim();
		switch(type){
		case "numarray":
			var arr = blob.split(/\s+/);
			for (var i=0; i<arr.length; i++){
				arr[i] = parseFloat(arr[i]);
			}
			return arr;
			break;
		case "json":
			return $.parseJSON(  blob );
			break;
		default:
			return blob;
		}
	},
	
	fill_para: function(obj, para){
		var name = para.attr('data-name');
		var type = para.attr('data-type');
		var ref  = para.attr('data-ref');
		var para_dr = para;
		// process (name,val) pair
		if(typeof ref !== "undefined"){
			para_dr = $(ref.trim());
			if (para_dr.length != 1)
				para_dr = para
		}
		if (typeof name == "undefined")
			name="";
		name=name.trim();
		var val  = para_dr.text().trim();
		if ( typeof type !== "undefined" ){
			val = plotxml.resolve(name, type.trim(), para_dr);
		}
		// save
		if(name)
			obj[name] = val;
		else if( (typeof val === "object") && (val !== null) )
			$.extend(obj, val);
	},
}