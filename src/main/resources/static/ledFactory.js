
var ledFactory = function(){/* empty constructor*/}
 
ledFactory.create = function( type, x, y, w, h, orientation )
{
	if( w < 0.1 ) w = 0.1;
	if( h < 0.1 ) h = 0.1;
	switch( type ) {
		
		case 2: 
			var l = new led3( 'green', x, y, w, h );
			x += w / 2;
			y += h / 2;
			var r1 = w/2;
			var r2 = h/2;
			var points = [];
			switch( orientation ) {
				case ORIENT_TOP:
				case ORIENT_BOTTOM:
				case ORIENT_MID_HORZ:
					points = [
						[ x - r1, y + 0, -1.5, 0 ],
						[ x - r1*0.66, y -r2, -1, -1.5 ],
						[ x + r1*0.66, y -r2, 1, -1.5 ],
						[ x + r1, y + 0, +1.5, 0 ],
						[ x + r1*0.66, y +r2, +1, +1.5 ],
						[ x - r1*0.66, y +r2, -1, +1.5 ],
					];
					break;
				case ORIENT_LEFT:
				case ORIENT_RIGHT:
				case ORIENT_EDGE_VERT:
				case ORIENT_MID_VERT:
					points = [
						[ x - 0, y - r2,  0, -1.5 ],
						[ x - r1, y - r2*0.66, -1.5, -1 ],
						[ x - r1, y + r2*0.66, -1.5,  1 ],
						[ x + 0, y + r2,  0, +1.5 ],
						[ x + r1, y + r2*0.66, +1.5, +1 ],
						[ x + r1, y - r2*0.66, +1.5, -1 ],
					];
					break;
					
			}
			l.points = points.splice(0);
			
			return l;
			
		case 4:
			var l = new led3( 'green', x, y, w, h );
			x += w / 2;
			y += h / 2;
			var r1 = w/2;
			var r2 = h/2;
			var points = [];
			switch( orientation ) {
				case ORIENT_TOP:
					points =[
						/*{ x, y, dx, dy }*/
						[x + r1 * 0.33, y - r2, +1.5, -1.5 ],
						[x - r1 * 0.33, y - r2, -1.5, -1.5 ],
						[x - r1, y + r2, -1.5, 1.5 ],
						[x + r1, y + r2,  1.5, 1.5 ]
					];
					break;
					
				case ORIENT_MID_HORZ:
				case ORIENT_BOTTOM:
					points =[
						/*{ x, y, dx, dy }*/
						[x + r1 * 0.33, y + r2, +1.5, + 1.5 ],
						[x - r1 * 0.33, y + r2, -1.5, + 1.5 ],
						[x - r1, y - r2, -1.5, -1.5 ],
						[x + r1, y - r2,  1.5, -1.5 ]
					];
					break;
				
				case ORIENT_EDGE_VERT:
					points =[
						/*{ x, y, dx, dy }*/
						[x - r1, y + r2 * 0.33, -1.5, +1.5 ],
						[x - r1, y - r2 * 0.33, -1.5, -1.5 ],
						[x + r1, y - r2,  1.5, -1.5 ],
						[x + r1, y + r2,  1.5,  1.5 ]
					];
					break;
				case ORIENT_LEFT:
					points =[
						/*{ x, y, dx, dy }*/
						[x - r1, y + r2 * 0.33, -1.5, +1.5 ],
						[x - r1, y - r2 * 0.33, -1.5, -1.5 ],
						[x + r1, y - r2,  1.5, -1.5 ],
						[x + r1, y + r2,  1.5,  1.5 ]
					];
					break;
				
				case ORIENT_RIGHT:
				case ORIENT_MID_VERT:
					points =[
						/*{ x, y, dx, dy }*/
						[x + r1, y + r2 * 0.33, 1.5, +1.5 ],
						[x + r1, y - r2 * 0.33, 1.5, -1.5 ],
						[x - r1, y - r2,  -1.5, -1.5 ],
						[x - r1, y + r2,  -1.5,  1.5 ]
					];
					break;
			}
			l.points = points.splice(0);
			
			return l;
			
		case 3:
			var l = new led3( 'green', x, y, w, h );
			x += w / 2;
			y += h / 2;
			var r1 = w/2;
			var r2 = h/2;
			var points = [];
			switch( orientation ) {
				case ORIENT_TOP:
					points =[
						/*{ x, y, dx, dy }*/
						[x + r1 * 0.33, y + r2, +1.5, + 1.5 ],
						[x - r1 * 0.33, y + r2, -1.5, + 1.5 ],
						[x - r1, y - r2, -1.5, -1.5 ],
						[x + r1, y - r2,  1.5, -1.5 ]
					];
					break;
					
				case ORIENT_MID_HORZ:
				case ORIENT_BOTTOM:
					points =[
						/*{ x, y, dx, dy }*/
						[x + r1 * 0.33, y - r2, +1.5, -1.5 ],
						[x - r1 * 0.33, y - r2, -1.5, -1.5 ],
						[x - r1, y + r2, -1.5, 1.5 ],
						[x + r1, y + r2,  1.5, 1.5 ]
					];
					break;
				
				case ORIENT_EDGE_VERT:
					points =[
						/*{ x, y, dx, dy }*/
						[x + r1, y + r2 * 0.33, 1.5, +1.5 ],
						[x + r1, y - r2 * 0.33, 1.5, -1.5 ],
						[x - r1, y - r2,  -1.5, -1.5 ],
						[x - r1, y + r2,  -1.5,  1.5 ]
					];
					break;
					
				case ORIENT_LEFT:
					points =[
						/*{ x, y, dx, dy }*/
						[x + r1, y + r2 * 0.33, 1.5, +1.5 ],
						[x + r1, y - r2 * 0.33, 1.5, -1.5 ],
						[x - r1, y - r2,  -1.5, -1.5 ],
						[x - r1, y + r2,  -1.5,  1.5 ]
					];
					break;
				
				case ORIENT_RIGHT:
				case ORIENT_MID_VERT:
					points =[
						/*{ x, y, dx, dy }*/
						[x - r1, y + r2 * 0.33, -1.5, +1.5 ],
						[x - r1, y - r2 * 0.33, -1.5, -1.5 ],
						[x + r1, y - r2,  1.5, -1.5 ],
						[x + r1, y + r2,  1.5,  1.5 ]
					];
					break;
			}
			l.points = points.splice(0);
			
			return l;
		case 1:
			var l = new led2( 'green', x, y, w, h );
			return l;
			
		case 0:
		default:
			var l = new led( 'green', x, y, w, h );
			return l;
	}
	return null;
}