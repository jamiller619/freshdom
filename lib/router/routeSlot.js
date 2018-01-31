import createElement from '../createElement'
import Element from '../jasmin'
import { assignTagNameTo } from '../tag'

class RouteSlot extends Element {}

assignTagNameTo(RouteSlot, 'route-slot')

export default RouteSlot
