# auto-notate

This is a simple JS library that wraps the RoughNotation library and binds it to DOM elements based on their CSS classes and `data-effect-` attributes. It's intended to be used with platforms like Webflow, so that users without lots of scripting experience can implement effects declaratively.

## API

### Effects

Effects are implemented via CSS classes bound to qualifying elements. The following are supported:

- `rn-effect-box`
- `rn-effect-bracket`
- `rn-effect-circle`
- `rn-effect-crossed-off`
- `rn-effect-highlight`
- `rn-effect-strike-through`
- `rn-effect-underline`

### Params

Many effects accept parameters (RoughNotation calls them options) such as color and padding. auto-notate reads these in via data attributes and passes them to the underlying library. Values match those specified in the RoughNotation API unless otherwise noted.

The following data attributes are supported:

#### `data-effect-animate`
#### `data-effect-bracket`

Value: a comma-delimited string containing some permutation of the tokens `left`, `right`, `top`, `bottom`. Repeats are allowed and will be drawn again in order.

#### `data-effect-color`
#### `data-effect-delay`

Value: a number representing the amount of time, in seconds, to wait before rendering the animation.

n.b. this is not part of the original RoughNotation implementation.

#### `data-effect-duration`
#### `data-effect-group`

Value: A string of the form `groupName/index`, where `groupName` is the name of the group and `index` is the item's place within the group (doesn't need to be consecutive).

#### `data-effect-iterations`
#### `data-effect-multiline`
#### `data-effect-padding`
#### `data-effect-stroke-width`
#### `data-effect-reverse`

Value: Boolean (i.e. no attribute value needed). Maps to the `rtl` option in the original library.

Note that RoughNotation only supports this option for the `highlight`, `underline`, `strike-through`, and `crosssed-off` effects.

---

## TODO

- support for event binding (as opposed to running on page load)
- flexible api naming conventions
- typescript support
