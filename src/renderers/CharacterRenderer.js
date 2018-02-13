const Renderer = require('./Renderer');
const StrokeRenderer = require('./StrokeRenderer');
const { assign, inherits } = require('../utils');


const exractStrokeProps = (strokeNum, props) => {
  if (!props.strokes) return props;
  return assign({
    usePolygonMasks: props.usePolygonMasks,
    strokeColor: props.strokeColor,
    radicalColor: props.radicalColor,
    strokeWidth: props.strokeWidth,
  }, props.strokes[strokeNum]);
};


function CharacterRenderer(character) {
  CharacterRenderer.super_.call(this);
  this._oldProps = {};
  this.character = character;
  this.strokeRenderers = this.character.strokes.map((stroke) => {
    return this.registerChild(new StrokeRenderer(stroke));
  });
}

inherits(CharacterRenderer, Renderer);

CharacterRenderer.prototype.mount = function(canvas, props) {
  const subCanvas = canvas.createSubCanvas();
  this._group = subCanvas.svg;
  this.strokeRenderers.forEach((strokeRenderer, i) => {
    strokeRenderer.mount(subCanvas, exractStrokeProps(i, props));
  });
};

CharacterRenderer.prototype.render = function(props) {
  if (props.opacity !== this._oldProps.opacity) {
    this._group.style.opacity = props.opacity;
  }
  for (let i = 0; i < this.strokeRenderers.length; i++) {
    this.strokeRenderers[i].render(exractStrokeProps(i, props));
  }
  this._oldProps = props;
};

module.exports = CharacterRenderer;