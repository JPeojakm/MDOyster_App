import { W as escape_html, X as fallback, Y as store_set, Q as setContext, Z as store_get, _ as add_styles, S as slot, $ as unsubscribe_stores, a0 as bind_props, R as pop, P as push, V as getContext, a1 as stringify, a2 as ensure_array_like, a3 as copy_payload, a4 as assign_payload, a5 as invalid_default_snippet } from "../../chunks/index.js";
import { w as writable, d as derived } from "../../chunks/index2.js";
import { InternSet, ascending } from "d3-array";
import { scaleLinear, scaleSqrt, scaleOrdinal } from "d3-scale";
import { rgb } from "d3-color";
import "clsx";
import { format } from "d3-format";
import { line, curveLinear } from "d3-shape";
const replacements = {
  translate: /* @__PURE__ */ new Map([
    [true, "yes"],
    [false, "no"]
  ])
};
function attr(name, value, is_boolean = false) {
  if (value == null || !value && is_boolean || value === "" && name === "class") return "";
  const normalized = name in replacements && replacements[name].get(value) || value;
  const assignment = is_boolean ? "" : `="${escape_html(normalized, true)}"`;
  return ` ${name}${assignment}`;
}
function html(value) {
  var html2 = String(value ?? "");
  var open = "<!---->";
  return open + html2 + "<!---->";
}
function canBeZero(val) {
  if (val === 0) {
    return true;
  }
  return val;
}
function makeAccessor(acc) {
  if (!canBeZero(acc)) return null;
  if (Array.isArray(acc)) {
    return (d) => acc.map((k) => {
      return typeof k !== "function" ? d[k] : k(d);
    });
  } else if (typeof acc !== "function") {
    return (d) => d[acc];
  }
  return acc;
}
function filterObject(obj, comparisonObj = {}) {
  return Object.fromEntries(
    Object.entries(obj).filter(([key, value]) => {
      return value !== void 0 && comparisonObj[key] === void 0;
    })
  );
}
function debounce(func, timeout = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
}
function calcUniques(data2, fields, sortOptions = {}) {
  if (!Array.isArray(data2)) {
    throw new TypeError(
      `The first argument of calcUniques() must be an array. You passed in a ${typeof data2}. If you got this error using the <LayerCake> component, consider passing a flat array to the \`flatData\` prop. More info: https://layercake.graphics/guide/#flatdata`
    );
  }
  if (Array.isArray(fields) || fields === void 0 || fields === null) {
    throw new TypeError(
      "The second argument of calcUniques() must be an object with field names as keys as accessor functions as values."
    );
  }
  const uniques = {};
  const keys = Object.keys(fields);
  const kl = keys.length;
  let i;
  let j;
  let k;
  let s;
  let acc;
  let val;
  let set;
  const dl = data2.length;
  for (i = 0; i < kl; i += 1) {
    set = new InternSet();
    s = keys[i];
    acc = fields[s];
    for (j = 0; j < dl; j += 1) {
      val = acc(data2[j]);
      if (Array.isArray(val)) {
        const vl = val.length;
        for (k = 0; k < vl; k += 1) {
          set.add(val[k]);
        }
      } else {
        set.add(val);
      }
    }
    const results = Array.from(set);
    if (sortOptions.sort === true || sortOptions[s] === true) {
      results.sort(ascending);
    }
    uniques[s] = results;
  }
  return uniques;
}
function calcExtents(data2, fields) {
  if (!Array.isArray(data2)) {
    throw new TypeError(
      `The first argument of calcExtents() must be an array. You passed in a ${typeof data2}. If you got this error using the <LayerCake> component, consider passing a flat array to the \`flatData\` prop. More info: https://layercake.graphics/guide/#flatdata`
    );
  }
  if (Array.isArray(fields) || fields === void 0 || fields === null) {
    throw new TypeError(
      "The second argument of calcExtents() must be an object with field names as keys as accessor functions as values."
    );
  }
  const extents = {};
  const keys = Object.keys(fields);
  const kl = keys.length;
  let i;
  let j;
  let k;
  let s;
  let min;
  let max;
  let acc;
  let val;
  const dl = data2.length;
  for (i = 0; i < kl; i += 1) {
    s = keys[i];
    acc = fields[s];
    min = null;
    max = null;
    for (j = 0; j < dl; j += 1) {
      val = acc(data2[j], j);
      if (Array.isArray(val)) {
        const vl = val.length;
        for (k = 0; k < vl; k += 1) {
          if (val[k] !== false && val[k] !== void 0 && val[k] !== null && Number.isNaN(val[k]) === false) {
            if (min === null || val[k] < min) {
              min = val[k];
            }
            if (max === null || val[k] > max) {
              max = val[k];
            }
          }
        }
      } else if (val !== false && val !== void 0 && val !== null && Number.isNaN(val) === false) {
        if (min === null || val < min) {
          min = val;
        }
        if (max === null || val > max) {
          max = val;
        }
      }
    }
    extents[s] = [min, max];
  }
  return extents;
}
function arraysEqual(arr1, arr2) {
  if (arr1.length !== arr2.length) return false;
  return arr1.every((k) => {
    return arr2.includes(k);
  });
}
function isOrdinalDomain(scale) {
  if (typeof scale.bandwidth === "function") {
    return true;
  }
  if (arraysEqual(Object.keys(scale), ["domain", "range", "unknown", "copy"])) {
    return true;
  }
  return false;
}
function calcScaleExtents(flatData, getters, activeScales) {
  const scaleGroups = Object.entries(activeScales).reduce(
    (groups, [k, scaleInfo]) => {
      const domainType = isOrdinalDomain(scaleInfo.scale) === true ? "ordinal" : "other";
      if (!groups[domainType]) groups[domainType] = {};
      groups[domainType][k] = getters[k];
      return groups;
    },
    { ordinal: false, other: false }
  );
  let extents = {};
  if (scaleGroups.ordinal) {
    const sortOptions = Object.fromEntries(
      Object.entries(activeScales).map(([k, scaleInfo]) => {
        return [k, scaleInfo.sort];
      })
    );
    extents = calcUniques(flatData, scaleGroups.ordinal, sortOptions);
  }
  if (scaleGroups.other) {
    extents = { ...extents, ...calcExtents(flatData, scaleGroups.other) };
  }
  return extents;
}
function partialDomain(domain = [], directive) {
  if (Array.isArray(directive) === true) {
    return directive.map((d, i) => {
      if (d === null) {
        return domain[i];
      }
      return d;
    });
  }
  return domain;
}
function calcDomain(s) {
  return function domainCalc([$extents, $domain]) {
    if (typeof $domain === "function") {
      $domain = $domain($extents[s]);
    }
    return $extents ? partialDomain($extents[s], $domain) : $domain;
  };
}
const defaultScales = {
  x: scaleLinear,
  y: scaleLinear,
  z: scaleLinear,
  r: scaleSqrt
};
function findScaleType(scale) {
  if (scale.constant) {
    return "symlog";
  }
  if (scale.base) {
    return "log";
  }
  if (scale.exponent) {
    if (scale.exponent() === 0.5) {
      return "sqrt";
    }
    return "pow";
  }
  return "other";
}
function identity(d) {
  return d;
}
function log(sign) {
  return (x) => Math.log(sign * x);
}
function exp(sign) {
  return (x) => sign * Math.exp(x);
}
function symlog(c) {
  return (x) => Math.sign(x) * Math.log1p(Math.abs(x / c));
}
function symexp(c) {
  return (x) => Math.sign(x) * Math.expm1(Math.abs(x)) * c;
}
function pow(exponent) {
  return function powFn(x) {
    return x < 0 ? -Math.pow(-x, exponent) : Math.pow(x, exponent);
  };
}
function getPadFunctions(scale) {
  const scaleType = findScaleType(scale);
  if (scaleType === "log") {
    const sign = Math.sign(scale.domain()[0]);
    return { lift: log(sign), ground: exp(sign), scaleType };
  }
  if (scaleType === "pow") {
    const exponent = 1;
    return { lift: pow(exponent), ground: pow(1 / exponent), scaleType };
  }
  if (scaleType === "sqrt") {
    const exponent = 0.5;
    return { lift: pow(exponent), ground: pow(1 / exponent), scaleType };
  }
  if (scaleType === "symlog") {
    const constant = 1;
    return { lift: symlog(constant), ground: symexp(constant), scaleType };
  }
  return { lift: identity, ground: identity, scaleType };
}
function toTitleCase(str) {
  return str.replace(/^\w/, (d) => d.toUpperCase());
}
function f(name, modifier = "") {
  return `scale${toTitleCase(modifier)}${toTitleCase(name)}`;
}
function findScaleName(scale) {
  if (typeof scale.bandwidth === "function") {
    if (typeof scale.paddingInner === "function") {
      return f("band");
    }
    return f("point");
  }
  if (arraysEqual(Object.keys(scale), ["domain", "range", "unknown", "copy"])) {
    return f("ordinal");
  }
  let modifier = "";
  if (scale.interpolator) {
    if (scale.domain().length === 3) {
      modifier = "diverging";
    } else {
      modifier = "sequential";
    }
  }
  if (scale.quantiles) {
    return f("quantile", modifier);
  }
  if (scale.thresholds) {
    return f("quantize", modifier);
  }
  if (scale.constant) {
    return f("symlog", modifier);
  }
  if (scale.base) {
    return f("log", modifier);
  }
  if (scale.exponent) {
    if (scale.exponent() === 0.5) {
      return f("sqrt", modifier);
    }
    return f("pow", modifier);
  }
  if (arraysEqual(Object.keys(scale), ["domain", "range", "invertExtent", "unknown", "copy"])) {
    return f("threshold");
  }
  if (arraysEqual(Object.keys(scale), [
    "invert",
    "range",
    "domain",
    "unknown",
    "copy",
    "ticks",
    "tickFormat",
    "nice"
  ])) {
    return f("identity");
  }
  if (arraysEqual(Object.keys(scale), [
    "invert",
    "domain",
    "range",
    "rangeRound",
    "round",
    "clamp",
    "unknown",
    "copy",
    "ticks",
    "tickFormat",
    "nice"
  ])) {
    return f("radial");
  }
  if (modifier) {
    return f(modifier);
  }
  if (scale.domain()[0] instanceof Date) {
    const d = /* @__PURE__ */ new Date();
    let s;
    d.getDay = () => s = "time";
    d.getUTCDay = () => s = "utc";
    scale.tickFormat(0, "%a")(d);
    return f(s);
  }
  return f("linear");
}
const unpaddable = ["scaleThreshold", "scaleQuantile", "scaleQuantize", "scaleSequentialQuantile"];
function padScale(scale, padding) {
  if (typeof scale.range !== "function") {
    throw new Error("Scale method `range` must be a function");
  }
  if (typeof scale.domain !== "function") {
    throw new Error("Scale method `domain` must be a function");
  }
  if (!Array.isArray(padding) || unpaddable.includes(findScaleName(scale))) {
    return scale.domain();
  }
  if (isOrdinalDomain(scale) === true) {
    return scale.domain();
  }
  const { lift, ground } = getPadFunctions(scale);
  const d0 = scale.domain()[0];
  const isTime = Object.prototype.toString.call(d0) === "[object Date]";
  const [d1, d2] = scale.domain().map((d) => {
    return isTime ? lift(d.getTime()) : lift(d);
  });
  const [r1, r2] = scale.range();
  const paddingLeft = padding[0] || 0;
  const paddingRight = padding[1] || 0;
  const step = (d2 - d1) / (Math.abs(r2 - r1) - paddingLeft - paddingRight);
  return [d1 - paddingLeft * step, paddingRight * step + d2].map((d) => {
    return isTime ? ground(new Date(d)) : ground(d);
  });
}
function calcBaseRange(s, width, height, reverse, percentRange) {
  let min;
  let max;
  if (percentRange === true) {
    min = 0;
    max = 100;
  } else {
    min = s === "r" ? 1 : 0;
    max = s === "y" ? height : s === "r" ? 25 : width;
  }
  return reverse === true ? [max, min] : [min, max];
}
function getDefaultRange(s, width, height, reverse, range, percentRange) {
  return !range ? calcBaseRange(s, width, height, reverse, percentRange) : typeof range === "function" ? range({ width, height }) : range;
}
function createScale(s) {
  return function scaleCreator([
    $scale,
    $extents,
    $domain,
    $padding,
    $nice,
    $reverse,
    $width,
    $height,
    $range,
    $percentScale
  ]) {
    if ($extents === null) {
      return null;
    }
    const defaultRange = getDefaultRange(s, $width, $height, $reverse, $range, $percentScale);
    const scale = $scale === defaultScales[s] ? $scale() : $scale.copy();
    scale.domain($domain);
    if (!scale.interpolator || typeof scale.interpolator === "function" && scale.interpolator().name.startsWith("identity")) {
      scale.range(defaultRange);
    }
    if ($padding) {
      scale.domain(padScale(scale, $padding));
    }
    if ($nice === true || typeof $nice === "number") {
      if (typeof scale.nice === "function") {
        scale.nice(typeof $nice === "number" ? $nice : void 0);
      } else {
        console.error(
          `[Layer Cake] You set \`${s}Nice: true\` but the ${s}Scale does not have a \`.nice\` method. Ignoring...`
        );
      }
    }
    return scale;
  };
}
function createGetter([$acc, $scale]) {
  return (d, i) => {
    const val = $acc(d, i);
    if (Array.isArray(val)) {
      return val.map((v) => $scale(v));
    }
    return $scale(val);
  };
}
function getRange([$scale]) {
  if (typeof $scale === "function") {
    if (typeof $scale.range === "function") {
      return $scale.range();
    }
    console.error("[LayerCake] Your scale doesn't have a `.range` method?");
  }
  return null;
}
const indent = "    ";
function getRgb(clr) {
  const { r, g, b, opacity: o } = rgb(clr);
  if (![r, g, b].every((c) => c >= 0 && c <= 255)) {
    return false;
  }
  return { r, g, b, o };
}
function contrast({ r, g, b }) {
  const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  return luminance > 0.6 ? "black" : "white";
}
function printDebug(obj) {
  console.log("/********* LayerCake Debug ************/");
  console.log("Bounding box:");
  printObject(obj.boundingBox);
  console.log("Data:");
  console.log(indent, obj.data);
  if (obj.flatData) {
    console.log("flatData:");
    console.log(indent, obj.flatData);
  }
  console.log("Scales:");
  Object.keys(obj.activeGetters).forEach((g) => {
    printScale(g, obj[`${g}Scale`], obj[g]);
  });
  console.log("/************ End LayerCake Debug ***************/\n");
}
function printObject(obj) {
  Object.entries(obj).forEach(([key, value]) => {
    console.log(`${indent}${key}:`, value);
  });
}
function printScale(s, scale, acc) {
  const scaleName = findScaleName(scale);
  console.log(`${indent}${s}:`);
  console.log(`${indent}${indent}Accessor: "${acc.toString()}"`);
  console.log(`${indent}${indent}Type: ${scaleName}`);
  printValues(scale, "domain");
  printValues(scale, "range", " ");
}
function printValues(scale, method, extraSpace = "") {
  const values = scale[method]();
  const colorValues = colorizeArray(values);
  if (colorValues) {
    printColorArray(colorValues, method, values);
  } else {
    console.log(`${indent}${indent}${toTitleCase(method)}:${extraSpace}`, values);
  }
}
function printColorArray(colorValues, method, values) {
  console.log(
    `${indent}${indent}${toTitleCase(method)}:    %cArray%c(${values.length}) ` + colorValues[0] + "%c ]",
    "color: #1377e4",
    "color: #737373",
    "color: #1478e4",
    ...colorValues[1],
    "color: #1478e4"
  );
}
function colorizeArray(arr) {
  const colors = [];
  const a = arr.map((d, i) => {
    const rgbo = getRgb(d);
    if (rgbo !== false) {
      colors.push(rgbo);
      const space = i === arr.length - 1 ? " " : "";
      return `%c ${d}${space}`;
    }
    return d;
  });
  if (colors.length) {
    return [
      `%c[ ${a.join(", ")}`,
      colors.map(
        (d) => `background-color: rgba(${d.r}, ${d.g}, ${d.b}, ${d.o}); color:${contrast(d)};`
      )
    ];
  }
  return null;
}
function LayerCake($$payload, $$props) {
  push();
  var $$store_subs;
  let yReverseValue, context;
  const printDebug_debounced = debounce(printDebug, 200);
  let ssr = fallback($$props["ssr"], false);
  let pointerEvents = fallback($$props["pointerEvents"], true);
  let position = fallback($$props["position"], "relative");
  let percentRange = fallback($$props["percentRange"], false);
  let width = fallback($$props["width"], void 0);
  let height = fallback($$props["height"], void 0);
  let containerWidth = fallback($$props["containerWidth"], width || 100);
  let containerHeight = fallback($$props["containerHeight"], height || 100);
  let element = fallback($$props["element"], void 0);
  let x = fallback($$props["x"], void 0);
  let y = fallback($$props["y"], void 0);
  let z = fallback($$props["z"], void 0);
  let r = fallback($$props["r"], void 0);
  let data2 = fallback($$props["data"], () => [], true);
  let xDomain = fallback($$props["xDomain"], void 0);
  let yDomain = fallback($$props["yDomain"], void 0);
  let zDomain = fallback($$props["zDomain"], void 0);
  let rDomain = fallback($$props["rDomain"], void 0);
  let xNice = fallback($$props["xNice"], false);
  let yNice = fallback($$props["yNice"], false);
  let zNice = fallback($$props["zNice"], false);
  let rNice = fallback($$props["rNice"], false);
  let xPadding = fallback($$props["xPadding"], void 0);
  let yPadding = fallback($$props["yPadding"], void 0);
  let zPadding = fallback($$props["zPadding"], void 0);
  let rPadding = fallback($$props["rPadding"], void 0);
  let xScale = fallback($$props["xScale"], () => defaultScales.x, true);
  let yScale = fallback($$props["yScale"], () => defaultScales.y, true);
  let zScale = fallback($$props["zScale"], () => defaultScales.z, true);
  let rScale = fallback($$props["rScale"], () => defaultScales.r, true);
  let xRange = fallback($$props["xRange"], void 0);
  let yRange = fallback($$props["yRange"], void 0);
  let zRange = fallback($$props["zRange"], void 0);
  let rRange = fallback($$props["rRange"], void 0);
  let xReverse = fallback($$props["xReverse"], false);
  let yReverse = fallback($$props["yReverse"], void 0);
  let zReverse = fallback($$props["zReverse"], false);
  let rReverse = fallback($$props["rReverse"], false);
  let xDomainSort = fallback($$props["xDomainSort"], true);
  let yDomainSort = fallback($$props["yDomainSort"], true);
  let zDomainSort = fallback($$props["zDomainSort"], true);
  let rDomainSort = fallback($$props["rDomainSort"], true);
  let padding = fallback($$props["padding"], () => ({}), true);
  let extents = fallback($$props["extents"], () => ({}), true);
  let flatData = fallback($$props["flatData"], void 0);
  let custom = fallback($$props["custom"], () => ({}), true);
  let debug = fallback($$props["debug"], false);
  let verbose = fallback($$props["verbose"], true);
  let isMounted = false;
  const config = {};
  const _percentRange = writable(percentRange);
  const _containerWidth = writable(containerWidth);
  const _containerHeight = writable(containerHeight);
  const _extents = writable(filterObject(extents));
  const _data = writable(data2);
  const _flatData = writable(flatData || data2);
  const _padding = writable(padding);
  const _x = writable(makeAccessor(x));
  const _y = writable(makeAccessor(y));
  const _z = writable(makeAccessor(z));
  const _r = writable(makeAccessor(r));
  const _xDomain = writable(xDomain);
  const _yDomain = writable(yDomain);
  const _zDomain = writable(zDomain);
  const _rDomain = writable(rDomain);
  const _xNice = writable(xNice);
  const _yNice = writable(yNice);
  const _zNice = writable(zNice);
  const _rNice = writable(rNice);
  const _xReverse = writable(xReverse);
  const _yReverse = writable(yReverseValue);
  const _zReverse = writable(zReverse);
  const _rReverse = writable(rReverse);
  const _xPadding = writable(xPadding);
  const _yPadding = writable(yPadding);
  const _zPadding = writable(zPadding);
  const _rPadding = writable(rPadding);
  const _xRange = writable(xRange);
  const _yRange = writable(yRange);
  const _zRange = writable(zRange);
  const _rRange = writable(rRange);
  const _xScale = writable(xScale);
  const _yScale = writable(yScale);
  const _zScale = writable(zScale);
  const _rScale = writable(rScale);
  const _xDomainSort = writable(xDomainSort);
  const _yDomainSort = writable(yDomainSort);
  const _zDomainSort = writable(zDomainSort);
  const _rDomainSort = writable(rDomainSort);
  const _config = writable(config);
  const _custom = writable(custom);
  const activeGetters_d = derived([_x, _y, _z, _r], ([$x, $y, $z, $r]) => {
    const obj = {};
    if ($x) {
      obj.x = $x;
    }
    if ($y) {
      obj.y = $y;
    }
    if ($z) {
      obj.z = $z;
    }
    if ($r) {
      obj.r = $r;
    }
    return obj;
  });
  const padding_d = derived([_padding, _containerWidth, _containerHeight], ([$padding]) => {
    const defaultPadding = { top: 0, right: 0, bottom: 0, left: 0 };
    return Object.assign(defaultPadding, $padding);
  });
  const box_d = derived([_containerWidth, _containerHeight, padding_d], ([$containerWidth, $containerHeight, $padding]) => {
    const b = {};
    b.top = $padding.top;
    b.right = $containerWidth - $padding.right;
    b.bottom = $containerHeight - $padding.bottom;
    b.left = $padding.left;
    b.width = b.right - b.left;
    b.height = b.bottom - b.top;
    if (verbose === true) {
      if (b.width <= 0 && isMounted === true) ;
      if (b.height <= 0 && isMounted === true) ;
    }
    return b;
  });
  const width_d = derived([box_d], ([$box]) => {
    return $box.width;
  });
  const height_d = derived([box_d], ([$box]) => {
    return $box.height;
  });
  const extents_d = derived(
    [
      _flatData,
      activeGetters_d,
      _extents,
      _xScale,
      _yScale,
      _rScale,
      _zScale,
      _xDomainSort,
      _yDomainSort,
      _zDomainSort,
      _rDomainSort
    ],
    ([
      $flatData,
      $activeGetters,
      $extents,
      $_xScale,
      $_yScale,
      $_rScale,
      $_zScale,
      $_xDomainSort,
      $_yDomainSort,
      $_zDomainSort,
      $_rDomainSort
    ]) => {
      const scaleLookup = {
        x: { scale: $_xScale, sort: $_xDomainSort },
        y: { scale: $_yScale, sort: $_yDomainSort },
        r: { scale: $_rScale, sort: $_rDomainSort },
        z: { scale: $_zScale, sort: $_zDomainSort }
      };
      const getters = filterObject($activeGetters, $extents);
      const activeScales = Object.fromEntries(Object.keys(getters).map((k) => [k, scaleLookup[k]]));
      if (Object.keys(getters).length > 0) {
        const calculatedExtents = calcScaleExtents($flatData, getters, activeScales);
        return { ...calculatedExtents, ...$extents };
      } else {
        return {};
      }
    }
  );
  const xDomain_d = derived([extents_d, _xDomain], calcDomain("x"));
  const yDomain_d = derived([extents_d, _yDomain], calcDomain("y"));
  const zDomain_d = derived([extents_d, _zDomain], calcDomain("z"));
  const rDomain_d = derived([extents_d, _rDomain], calcDomain("r"));
  const xScale_d = derived(
    [
      _xScale,
      extents_d,
      xDomain_d,
      _xPadding,
      _xNice,
      _xReverse,
      width_d,
      height_d,
      _xRange,
      _percentRange
    ],
    createScale("x")
  );
  const xGet_d = derived([_x, xScale_d], createGetter);
  const yScale_d = derived(
    [
      _yScale,
      extents_d,
      yDomain_d,
      _yPadding,
      _yNice,
      _yReverse,
      width_d,
      height_d,
      _yRange,
      _percentRange
    ],
    createScale("y")
  );
  const yGet_d = derived([_y, yScale_d], createGetter);
  const zScale_d = derived(
    [
      _zScale,
      extents_d,
      zDomain_d,
      _zPadding,
      _zNice,
      _zReverse,
      width_d,
      height_d,
      _zRange,
      _percentRange
    ],
    createScale("z")
  );
  const zGet_d = derived([_z, zScale_d], createGetter);
  const rScale_d = derived(
    [
      _rScale,
      extents_d,
      rDomain_d,
      _rPadding,
      _rNice,
      _rReverse,
      width_d,
      height_d,
      _rRange,
      _percentRange
    ],
    createScale("r")
  );
  const rGet_d = derived([_r, rScale_d], createGetter);
  const xDomain_d_possibly_nice = derived(xScale_d, ($xScale_d) => $xScale_d.domain());
  const yDomain_d_possibly_nice = derived(yScale_d, ($yScale_d) => $yScale_d.domain());
  const zDomain_d_possibly_nice = derived(zScale_d, ($zScale_d) => $zScale_d.domain());
  const rDomain_d_possibly_nice = derived(rScale_d, ($rScale_d) => $rScale_d.domain());
  const xRange_d = derived([xScale_d], getRange);
  const yRange_d = derived([yScale_d], getRange);
  const zRange_d = derived([zScale_d], getRange);
  const rRange_d = derived([rScale_d], getRange);
  const aspectRatio_d = derived([width_d, height_d], ([$width, $height]) => {
    return $width / $height;
  });
  yReverseValue = typeof yReverse === "undefined" ? typeof yScale.bandwidth === "function" ? false : true : yReverse;
  if (x) config.x = x;
  if (y) config.y = y;
  if (z) config.z = z;
  if (r) config.r = r;
  if (xDomain) config.xDomain = xDomain;
  if (yDomain) config.yDomain = yDomain;
  if (zDomain) config.zDomain = zDomain;
  if (rDomain) config.rDomain = rDomain;
  if (xRange) config.xRange = xRange;
  if (yRange) config.yRange = yRange;
  if (zRange) config.zRange = zRange;
  if (rRange) config.rRange = rRange;
  store_set(_percentRange, percentRange);
  store_set(_containerWidth, containerWidth);
  store_set(_containerHeight, containerHeight);
  store_set(_extents, filterObject(extents));
  store_set(_data, data2);
  store_set(_flatData, flatData || data2);
  store_set(_padding, padding);
  store_set(_x, makeAccessor(x));
  store_set(_y, makeAccessor(y));
  store_set(_z, makeAccessor(z));
  store_set(_r, makeAccessor(r));
  store_set(_xDomain, xDomain);
  store_set(_yDomain, yDomain);
  store_set(_zDomain, zDomain);
  store_set(_rDomain, rDomain);
  store_set(_xNice, xNice);
  store_set(_yNice, yNice);
  store_set(_zNice, zNice);
  store_set(_rNice, rNice);
  store_set(_xReverse, xReverse);
  store_set(_yReverse, yReverseValue);
  store_set(_zReverse, zReverse);
  store_set(_rReverse, rReverse);
  store_set(_xPadding, xPadding);
  store_set(_yPadding, yPadding);
  store_set(_zPadding, zPadding);
  store_set(_rPadding, rPadding);
  store_set(_xRange, xRange);
  store_set(_yRange, yRange);
  store_set(_zRange, zRange);
  store_set(_rRange, rRange);
  store_set(_xScale, xScale);
  store_set(_yScale, yScale);
  store_set(_zScale, zScale);
  store_set(_rScale, rScale);
  store_set(_custom, custom);
  store_set(_config, config);
  context = {
    activeGetters: activeGetters_d,
    width: width_d,
    height: height_d,
    percentRange: _percentRange,
    aspectRatio: aspectRatio_d,
    containerWidth: _containerWidth,
    containerHeight: _containerHeight,
    x: _x,
    y: _y,
    z: _z,
    r: _r,
    custom: _custom,
    data: _data,
    xNice: _xNice,
    yNice: _yNice,
    zNice: _zNice,
    rNice: _rNice,
    xDomainSort: _xDomainSort,
    yDomainSort: _yDomainSort,
    zDomainSort: _zDomainSort,
    rDomainSort: _rDomainSort,
    xReverse: _xReverse,
    yReverse: _yReverse,
    zReverse: _zReverse,
    rReverse: _rReverse,
    xPadding: _xPadding,
    yPadding: _yPadding,
    zPadding: _zPadding,
    rPadding: _rPadding,
    padding: padding_d,
    flatData: _flatData,
    extents: extents_d,
    xDomain: xDomain_d_possibly_nice,
    yDomain: yDomain_d_possibly_nice,
    zDomain: zDomain_d_possibly_nice,
    rDomain: rDomain_d_possibly_nice,
    xRange: xRange_d,
    yRange: yRange_d,
    zRange: zRange_d,
    rRange: rRange_d,
    config: _config,
    xScale: xScale_d,
    xGet: xGet_d,
    yScale: yScale_d,
    yGet: yGet_d,
    zScale: zScale_d,
    zGet: zGet_d,
    rScale: rScale_d,
    rGet: rGet_d
  };
  setContext("LayerCake", context);
  if (store_get($$store_subs ??= {}, "$box_d", box_d) && debug === true && (ssr === true || typeof window !== "undefined")) {
    printDebug_debounced({
      data: store_get($$store_subs ??= {}, "$_data", _data),
      flatData: typeof flatData !== "undefined" ? store_get($$store_subs ??= {}, "$_flatData", _flatData) : null,
      boundingBox: store_get($$store_subs ??= {}, "$box_d", box_d),
      activeGetters: store_get($$store_subs ??= {}, "$activeGetters_d", activeGetters_d),
      x: config.x,
      y: config.y,
      z: config.z,
      r: config.r,
      xScale: store_get($$store_subs ??= {}, "$xScale_d", xScale_d),
      yScale: store_get($$store_subs ??= {}, "$yScale_d", yScale_d),
      zScale: store_get($$store_subs ??= {}, "$zScale_d", zScale_d),
      rScale: store_get($$store_subs ??= {}, "$rScale_d", rScale_d)
    });
  }
  if (ssr === true || typeof window !== "undefined") {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div${add_styles({
      position,
      top: position === "absolute" ? "0" : null,
      right: position === "absolute" ? "0" : null,
      bottom: position === "absolute" ? "0" : null,
      left: position === "absolute" ? "0" : null,
      "pointer-events": pointerEvents === false ? "none" : null
    })} class="layercake-container svelte-vhzpsp"><!---->`;
    slot(
      $$payload,
      $$props,
      "default",
      {
        element,
        width: store_get($$store_subs ??= {}, "$width_d", width_d),
        height: store_get($$store_subs ??= {}, "$height_d", height_d),
        aspectRatio: store_get($$store_subs ??= {}, "$aspectRatio_d", aspectRatio_d),
        containerWidth: store_get($$store_subs ??= {}, "$_containerWidth", _containerWidth),
        containerHeight: store_get($$store_subs ??= {}, "$_containerHeight", _containerHeight),
        activeGetters: store_get($$store_subs ??= {}, "$activeGetters_d", activeGetters_d),
        percentRange: store_get($$store_subs ??= {}, "$_percentRange", _percentRange),
        x: store_get($$store_subs ??= {}, "$_x", _x),
        y: store_get($$store_subs ??= {}, "$_y", _y),
        z: store_get($$store_subs ??= {}, "$_z", _z),
        r: store_get($$store_subs ??= {}, "$_r", _r),
        custom: store_get($$store_subs ??= {}, "$_custom", _custom),
        data: store_get($$store_subs ??= {}, "$_data", _data),
        xNice: store_get($$store_subs ??= {}, "$_xNice", _xNice),
        yNice: store_get($$store_subs ??= {}, "$_yNice", _yNice),
        zNice: store_get($$store_subs ??= {}, "$_zNice", _zNice),
        rNice: store_get($$store_subs ??= {}, "$_rNice", _rNice),
        xDomainSort: store_get($$store_subs ??= {}, "$_xDomainSort", _xDomainSort),
        yDomainSort: store_get($$store_subs ??= {}, "$_yDomainSort", _yDomainSort),
        zDomainSort: store_get($$store_subs ??= {}, "$_zDomainSort", _zDomainSort),
        rDomainSort: store_get($$store_subs ??= {}, "$_rDomainSort", _rDomainSort),
        xReverse: store_get($$store_subs ??= {}, "$_xReverse", _xReverse),
        yReverse: store_get($$store_subs ??= {}, "$_yReverse", _yReverse),
        zReverse: store_get($$store_subs ??= {}, "$_zReverse", _zReverse),
        rReverse: store_get($$store_subs ??= {}, "$_rReverse", _rReverse),
        xPadding: store_get($$store_subs ??= {}, "$_xPadding", _xPadding),
        yPadding: store_get($$store_subs ??= {}, "$_yPadding", _yPadding),
        zPadding: store_get($$store_subs ??= {}, "$_zPadding", _zPadding),
        rPadding: store_get($$store_subs ??= {}, "$_rPadding", _rPadding),
        padding: store_get($$store_subs ??= {}, "$padding_d", padding_d),
        flatData: store_get($$store_subs ??= {}, "$_flatData", _flatData),
        extents: store_get($$store_subs ??= {}, "$extents_d", extents_d),
        xDomain: store_get($$store_subs ??= {}, "$xDomain_d", xDomain_d),
        yDomain: store_get($$store_subs ??= {}, "$yDomain_d", yDomain_d),
        zDomain: store_get($$store_subs ??= {}, "$zDomain_d", zDomain_d),
        rDomain: store_get($$store_subs ??= {}, "$rDomain_d", rDomain_d),
        xRange: store_get($$store_subs ??= {}, "$xRange_d", xRange_d),
        yRange: store_get($$store_subs ??= {}, "$yRange_d", yRange_d),
        zRange: store_get($$store_subs ??= {}, "$zRange_d", zRange_d),
        rRange: store_get($$store_subs ??= {}, "$rRange_d", rRange_d),
        config: store_get($$store_subs ??= {}, "$_config", _config),
        xScale: store_get($$store_subs ??= {}, "$xScale_d", xScale_d),
        xGet: store_get($$store_subs ??= {}, "$xGet_d", xGet_d),
        yScale: store_get($$store_subs ??= {}, "$yScale_d", yScale_d),
        yGet: store_get($$store_subs ??= {}, "$yGet_d", yGet_d),
        zScale: store_get($$store_subs ??= {}, "$zScale_d", zScale_d),
        zGet: store_get($$store_subs ??= {}, "$zGet_d", zGet_d),
        rScale: store_get($$store_subs ??= {}, "$rScale_d", rScale_d),
        rGet: store_get($$store_subs ??= {}, "$rGet_d", rGet_d)
      },
      null
    );
    $$payload.out += `<!----></div>`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]-->`;
  if ($$store_subs) unsubscribe_stores($$store_subs);
  bind_props($$props, {
    ssr,
    pointerEvents,
    position,
    percentRange,
    width,
    height,
    containerWidth,
    containerHeight,
    element,
    x,
    y,
    z,
    r,
    data: data2,
    xDomain,
    yDomain,
    zDomain,
    rDomain,
    xNice,
    yNice,
    zNice,
    rNice,
    xPadding,
    yPadding,
    zPadding,
    rPadding,
    xScale,
    yScale,
    zScale,
    rScale,
    xRange,
    yRange,
    zRange,
    rRange,
    xReverse,
    yReverse,
    zReverse,
    rReverse,
    xDomainSort,
    yDomainSort,
    zDomainSort,
    rDomainSort,
    padding,
    extents,
    flatData,
    custom,
    debug,
    verbose
  });
  pop();
}
function Html($$payload, $$props) {
  push();
  var $$store_subs;
  let roleVal;
  const { padding } = getContext("LayerCake");
  let element = fallback($$props["element"], void 0);
  let zIndex = fallback($$props["zIndex"], void 0);
  let pointerEvents = fallback($$props["pointerEvents"], void 0);
  let role = fallback($$props["role"], void 0);
  let label = fallback($$props["label"], void 0);
  let labelledBy = fallback($$props["labelledBy"], void 0);
  let describedBy = fallback($$props["describedBy"], void 0);
  roleVal = role || (label || labelledBy || describedBy ? "figure" : void 0);
  $$payload.out += `<div${add_styles({
    "z-index": zIndex,
    "pointer-events": pointerEvents === false ? "none" : null,
    top: store_get($$store_subs ??= {}, "$padding", padding).top + "px",
    right: store_get($$store_subs ??= {}, "$padding", padding).right + "px",
    bottom: store_get($$store_subs ??= {}, "$padding", padding).bottom + "px",
    left: store_get($$store_subs ??= {}, "$padding", padding).left + "px"
  })} class="layercake-layout-html svelte-1x3xzit"${attr("role", roleVal)}${attr("aria-label", label)}${attr("aria-labelledby", labelledBy)}${attr("aria-describedby", describedBy)}><!---->`;
  slot($$payload, $$props, "default", { element }, null);
  $$payload.out += `<!----></div>`;
  if ($$store_subs) unsubscribe_stores($$store_subs);
  bind_props($$props, {
    element,
    zIndex,
    pointerEvents,
    role,
    label,
    labelledBy,
    describedBy
  });
  pop();
}
function Svg($$payload, $$props) {
  push();
  var $$store_subs;
  let element = fallback($$props["element"], void 0);
  let innerElement = fallback($$props["innerElement"], void 0);
  let zIndex = fallback($$props["zIndex"], void 0);
  let pointerEvents = fallback($$props["pointerEvents"], void 0);
  let viewBox = fallback($$props["viewBox"], void 0);
  let label = fallback($$props["label"], void 0);
  let labelledBy = fallback($$props["labelledBy"], void 0);
  let describedBy = fallback($$props["describedBy"], void 0);
  let title = fallback($$props["title"], void 0);
  const { containerWidth, containerHeight, padding } = getContext("LayerCake");
  $$payload.out += `<svg${add_styles({
    "z-index": zIndex,
    "pointer-events": pointerEvents === false ? "none" : null
  })} class="layercake-layout-svg svelte-u84d8d"${attr("viewBox", viewBox)}${attr("width", store_get($$store_subs ??= {}, "$containerWidth", containerWidth))}${attr("height", store_get($$store_subs ??= {}, "$containerHeight", containerHeight))}${attr("aria-label", label)}${attr("aria-labelledby", labelledBy)}${attr("aria-describedby", describedBy)}><!---->`;
  slot($$payload, $$props, "title", {}, () => {
    if (title) {
      $$payload.out += "<!--[-->";
      $$payload.out += `<title>${escape_html(title)}</title>`;
    } else {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]-->`;
  });
  $$payload.out += `<!----><defs><!---->`;
  slot($$payload, $$props, "defs", {}, null);
  $$payload.out += `<!----></defs><g class="layercake-layout-svg_g"${attr("transform", `translate(${stringify(store_get($$store_subs ??= {}, "$padding", padding).left)}, ${stringify(store_get($$store_subs ??= {}, "$padding", padding).top)})`)}><!---->`;
  slot($$payload, $$props, "default", { element }, null);
  $$payload.out += `<!----></g></svg>`;
  if ($$store_subs) unsubscribe_stores($$store_subs);
  bind_props($$props, {
    element,
    innerElement,
    zIndex,
    pointerEvents,
    viewBox,
    label,
    labelledBy,
    describedBy,
    title
  });
  pop();
}
function MultiLine($$payload, $$props) {
  push();
  var $$store_subs;
  let path;
  const { data: data2, xGet, yGet, zGet } = getContext("LayerCake");
  let curve = fallback($$props["curve"], curveLinear);
  path = line().x(store_get($$store_subs ??= {}, "$xGet", xGet)).y(store_get($$store_subs ??= {}, "$yGet", yGet)).curve(curve);
  const each_array = ensure_array_like(store_get($$store_subs ??= {}, "$data", data2));
  $$payload.out += `<g class="line-group"><!--[-->`;
  for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
    let group = each_array[$$index];
    $$payload.out += `<path class="path-line svelte-tqv5lw"${attr("d", path(group.values))}${attr("stroke", store_get($$store_subs ??= {}, "$zGet", zGet)(group))}></path>`;
  }
  $$payload.out += `<!--]--></g>`;
  if ($$store_subs) unsubscribe_stores($$store_subs);
  bind_props($$props, { curve });
  pop();
}
function AxisX($$payload, $$props) {
  push();
  var $$store_subs;
  let tickLen, isBandwidth, tickVals, halfBand;
  const { width, height, xScale, yRange } = getContext("LayerCake");
  let tickMarks = fallback($$props["tickMarks"], false);
  let gridlines = fallback($$props["gridlines"], true);
  let tickMarkLength = fallback($$props["tickMarkLength"], 6);
  let baseline = fallback($$props["baseline"], false);
  let snapLabels = fallback($$props["snapLabels"], false);
  let format2 = fallback($$props["format"], (d) => d);
  let ticks = fallback($$props["ticks"], void 0);
  let tickGutter = fallback($$props["tickGutter"], 0);
  let dx = fallback($$props["dx"], 0);
  let dy = fallback($$props["dy"], 12);
  function textAnchor(i, sl) {
    if (sl === true) {
      if (i === 0) {
        return "start";
      }
      if (i === tickVals.length - 1) {
        return "end";
      }
    }
    return "middle";
  }
  tickLen = tickMarks === true ? tickMarkLength ?? 6 : 0;
  isBandwidth = typeof store_get($$store_subs ??= {}, "$xScale", xScale).bandwidth === "function";
  tickVals = Array.isArray(ticks) ? ticks : isBandwidth ? store_get($$store_subs ??= {}, "$xScale", xScale).domain() : typeof ticks === "function" ? ticks(store_get($$store_subs ??= {}, "$xScale", xScale).ticks()) : store_get($$store_subs ??= {}, "$xScale", xScale).ticks(ticks);
  halfBand = isBandwidth ? store_get($$store_subs ??= {}, "$xScale", xScale).bandwidth() / 2 : 0;
  const each_array = ensure_array_like(tickVals);
  $$payload.out += `<g${attr("class", `axis x-axis svelte-1ezueh ${stringify([snapLabels ? "snapLabels" : ""].filter(Boolean).join(" "))}`)}><!--[-->`;
  for (let i = 0, $$length = each_array.length; i < $$length; i++) {
    let tick = each_array[i];
    if (baseline === true) {
      $$payload.out += "<!--[-->";
      $$payload.out += `<line class="baseline svelte-1ezueh"${attr("y1", store_get($$store_subs ??= {}, "$height", height))}${attr("y2", store_get($$store_subs ??= {}, "$height", height))} x1="0"${attr("x2", store_get($$store_subs ??= {}, "$width", width))}></line>`;
    } else {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]--><g${attr("class", `tick tick-${stringify(i)} svelte-1ezueh`)}${attr("transform", `translate(${stringify(store_get($$store_subs ??= {}, "$xScale", xScale)(tick))},${stringify(Math.max(...store_get($$store_subs ??= {}, "$yRange", yRange)))})`)}>`;
    if (gridlines === true) {
      $$payload.out += "<!--[-->";
      $$payload.out += `<line class="gridline svelte-1ezueh"${attr("x1", halfBand)}${attr("x2", halfBand)}${attr("y1", -store_get($$store_subs ??= {}, "$height", height))} y2="0"></line>`;
    } else {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]-->`;
    if (tickMarks === true) {
      $$payload.out += "<!--[-->";
      $$payload.out += `<line class="tick-mark svelte-1ezueh"${attr("x1", halfBand)}${attr("x2", halfBand)}${attr("y1", tickGutter)}${attr("y2", tickGutter + tickLen)}></line>`;
    } else {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]--><text${attr("x", halfBand)}${attr("y", tickGutter + tickLen)}${attr("dx", dx)}${attr("dy", dy)}${attr("text-anchor", textAnchor(i, snapLabels))} class="svelte-1ezueh">${escape_html(format2(tick))}</text></g>`;
  }
  $$payload.out += `<!--]--></g>`;
  if ($$store_subs) unsubscribe_stores($$store_subs);
  bind_props($$props, {
    tickMarks,
    gridlines,
    tickMarkLength,
    baseline,
    snapLabels,
    format: format2,
    ticks,
    tickGutter,
    dx,
    dy
  });
  pop();
}
function AxisY($$payload, $$props) {
  push();
  var $$store_subs;
  let isBandwidth, tickVals, widestTickLen, tickLen, x1, y, maxTickValPx;
  const { xRange, yScale, width } = getContext("LayerCake");
  let tickMarks = fallback($$props["tickMarks"], false);
  let labelPosition = fallback($$props["labelPosition"], "even");
  let snapBaselineLabel = fallback($$props["snapBaselineLabel"], false);
  let gridlines = fallback($$props["gridlines"], true);
  let tickMarkLength = fallback($$props["tickMarkLength"], void 0);
  let format2 = fallback($$props["format"], (d) => d);
  let ticks = fallback($$props["ticks"], 4);
  let tickGutter = fallback($$props["tickGutter"], 0);
  let dx = fallback($$props["dx"], 0);
  let dy = fallback($$props["dy"], 0);
  let charPixelWidth = fallback($$props["charPixelWidth"], 7.25);
  function calcStringLength(sum, val) {
    if (val === "," || val === ".") return sum + charPixelWidth * 0.5;
    return sum + charPixelWidth;
  }
  isBandwidth = typeof store_get($$store_subs ??= {}, "$yScale", yScale).bandwidth === "function";
  tickVals = Array.isArray(ticks) ? ticks : isBandwidth ? store_get($$store_subs ??= {}, "$yScale", yScale).domain() : typeof ticks === "function" ? ticks(store_get($$store_subs ??= {}, "$yScale", yScale).ticks()) : store_get($$store_subs ??= {}, "$yScale", yScale).ticks(ticks);
  widestTickLen = Math.max(10, Math.max(...tickVals.map((d) => format2(d).toString().split("").reduce(calcStringLength, 0))));
  tickLen = tickMarks === true ? labelPosition === "above" ? tickMarkLength ?? widestTickLen : tickMarkLength ?? 6 : 0;
  x1 = -tickGutter - (labelPosition === "above" ? widestTickLen : tickLen);
  y = isBandwidth ? store_get($$store_subs ??= {}, "$yScale", yScale).bandwidth() / 2 : 0;
  maxTickValPx = Math.max(...tickVals.map(store_get($$store_subs ??= {}, "$yScale", yScale)));
  const each_array = ensure_array_like(tickVals);
  $$payload.out += `<g class="axis y-axis"><!--[-->`;
  for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
    let tick = each_array[$$index];
    const tickValPx = store_get($$store_subs ??= {}, "$yScale", yScale)(tick);
    $$payload.out += `<g${attr("class", `tick tick-${stringify(tick)} svelte-1jg5nf1`)}${attr("transform", `translate(${stringify(store_get($$store_subs ??= {}, "$xRange", xRange)[0])}, ${stringify(tickValPx)})`)}>`;
    if (gridlines === true) {
      $$payload.out += "<!--[-->";
      $$payload.out += `<line class="gridline svelte-1jg5nf1"${attr("x1", x1)}${attr("x2", store_get($$store_subs ??= {}, "$width", width))}${attr("y1", y)}${attr("y2", y)}></line>`;
    } else {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]-->`;
    if (tickMarks === true) {
      $$payload.out += "<!--[-->";
      $$payload.out += `<line class="tick-mark svelte-1jg5nf1"${attr("x1", x1)}${attr("x2", x1 + tickLen)}${attr("y1", y)}${attr("y2", y)}></line>`;
    } else {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]--><text${attr("x", x1)}${attr("y", y)}${attr("dx", dx + (labelPosition === "even" ? -3 : 0))}${attr("text-anchor", labelPosition === "above" ? "start" : "end")}${attr("dy", dy + (labelPosition === "above" || snapBaselineLabel === true && tickValPx === maxTickValPx ? -3 : 4))} class="svelte-1jg5nf1">${escape_html(format2(tick))}</text></g>`;
  }
  $$payload.out += `<!--]--></g>`;
  if ($$store_subs) unsubscribe_stores($$store_subs);
  bind_props($$props, {
    tickMarks,
    labelPosition,
    snapBaselineLabel,
    gridlines,
    tickMarkLength,
    format: format2,
    ticks,
    tickGutter,
    dx,
    dy,
    charPixelWidth
  });
  pop();
}
function GroupLabels_html($$payload, $$props) {
  push();
  var $$store_subs;
  const { data: data2, z, zScale } = getContext("LayerCake");
  const each_array = ensure_array_like(store_get($$store_subs ??= {}, "$data", data2));
  $$payload.out += `<div class="legend svelte-14mlpw8"><!--[-->`;
  for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
    let group = each_array[$$index];
    $$payload.out += `<div class="legend-item svelte-14mlpw8"><span class="color-box svelte-14mlpw8"${attr("style", `background-color: ${stringify(store_get($$store_subs ??= {}, "$zScale", zScale)(store_get($$store_subs ??= {}, "$z", z)(group)))};`)}></span> <span class="label svelte-14mlpw8">${escape_html(store_get($$store_subs ??= {}, "$z", z)(group))}</span></div>`;
  }
  $$payload.out += `<!--]--></div>`;
  if ($$store_subs) unsubscribe_stores($$store_subs);
  pop();
}
function FrontLayout($$payload, $$props) {
  let frontImgUrl = fallback($$props["frontImgUrl"], "./src/routes/_img/baltimore_oyster.jpg");
  let title = fallback($$props["title"], "Unloading oyster luggers");
  let description = fallback($$props["description"], "Oyster Wars of the Chesapeake Bay");
  $$payload.out += `<section class="front-layout svelte-1jthc7t"><div class="front-img svelte-1jthc7t"><img${attr("src", frontImgUrl)} alt="Descriptive Alt Text" class="svelte-1jthc7t"></div> <div class="front-text svelte-1jthc7t"><h1 class="svelte-1jthc7t">${escape_html(title)}</h1> <p class="svelte-1jthc7t">${escape_html(description)}</p></div></section>`;
  bind_props($$props, { frontImgUrl, title, description });
}
function Scrolly($$payload, $$props) {
  push();
  let root = fallback($$props["root"], null);
  let top = fallback($$props["top"], 0);
  let bottom = fallback($$props["bottom"], 0);
  let increments = fallback($$props["increments"], 100);
  let value = fallback($$props["value"], void 0);
  const steps = [];
  let nodes = [];
  let intersectionObservers = [];
  const update = () => {
    if (!nodes.length) return;
    nodes.forEach(createObserver);
  };
  const mostInView = () => {
    let maxRatio = 0;
    let maxIndex = 0;
    for (let i = 0; i < steps.length; i++) {
      if (steps[i] > maxRatio) {
        maxRatio = steps[i];
        maxIndex = i;
      }
    }
    if (maxRatio > 0) {
      console.log(`Activating step ${maxIndex}`);
      value = maxIndex;
    } else {
      value = void 0;
    }
  };
  const createObserver = (node, index) => {
    const handleIntersect = (e) => {
      e[0].isIntersecting;
      const ratio = e[0].intersectionRatio;
      steps[index] = ratio;
      mostInView();
    };
    const options = {
      root: null,
      rootMargin: "0px 0px -50px 0px",
      threshold: [0.1, 0.5, 1]
      // 元素至少有 50% 可见才触发
    };
    if (intersectionObservers[index]) intersectionObservers[index].disconnect();
    const io = new IntersectionObserver(handleIntersect, options);
    io.observe(node);
    intersectionObservers[index] = io;
  };
  update();
  $$payload.out += `<div><!---->`;
  slot($$payload, $$props, "default", {}, null);
  $$payload.out += `<!----></div>`;
  bind_props($$props, { root, top, bottom, increments, value });
  pop();
}
const data = [
  {
    Year: 2023,
    State: "MARYLAND",
    "Metric Tons": 872
  },
  {
    Year: 2023,
    State: "VIRGINIA",
    "Metric Tons": 1980
  },
  {
    Year: 2022,
    State: "MARYLAND",
    "Metric Tons": 802
  },
  {
    Year: 2022,
    State: "VIRGINIA",
    "Metric Tons": 2009
  },
  {
    Year: 2021,
    State: "MARYLAND",
    "Metric Tons": 631
  },
  {
    Year: 2021,
    State: "VIRGINIA",
    "Metric Tons": 1648
  },
  {
    Year: 2020,
    State: "MARYLAND",
    "Metric Tons": 425
  },
  {
    Year: 2020,
    State: "VIRGINIA",
    "Metric Tons": 1352
  },
  {
    Year: 2019,
    State: "MARYLAND",
    "Metric Tons": 298
  },
  {
    Year: 2019,
    State: "VIRGINIA",
    "Metric Tons": 1558
  },
  {
    Year: 2018,
    State: "MARYLAND",
    "Metric Tons": 211
  },
  {
    Year: 2018,
    State: "VIRGINIA",
    "Metric Tons": 1724
  },
  {
    Year: 2017,
    State: "MARYLAND",
    "Metric Tons": 305
  },
  {
    Year: 2017,
    State: "VIRGINIA",
    "Metric Tons": 1854
  },
  {
    Year: 2016,
    State: "MARYLAND",
    "Metric Tons": 402
  },
  {
    Year: 2016,
    State: "VIRGINIA",
    "Metric Tons": 1849
  },
  {
    Year: 2015,
    State: "MARYLAND",
    "Metric Tons": 540
  },
  {
    Year: 2015,
    State: "VIRGINIA",
    "Metric Tons": 2081
  },
  {
    Year: 2014,
    State: "MARYLAND",
    "Metric Tons": 543
  },
  {
    Year: 2014,
    State: "VIRGINIA",
    "Metric Tons": 1708
  },
  {
    Year: 2013,
    State: "MARYLAND",
    "Metric Tons": 637
  },
  {
    Year: 2013,
    State: "VIRGINIA",
    "Metric Tons": 1471
  },
  {
    Year: 2012,
    State: "MARYLAND",
    "Metric Tons": 278
  },
  {
    Year: 2012,
    State: "VIRGINIA",
    "Metric Tons": 885
  },
  {
    Year: 2011,
    State: "MARYLAND",
    "Metric Tons": 161
  },
  {
    Year: 2011,
    State: "VIRGINIA",
    "Metric Tons": 687
  },
  {
    Year: 2010,
    State: "MARYLAND",
    "Metric Tons": 185
  },
  {
    Year: 2010,
    State: "VIRGINIA",
    "Metric Tons": 534
  },
  {
    Year: 2009,
    State: "MARYLAND",
    "Metric Tons": 226
  },
  {
    Year: 2009,
    State: "VIRGINIA",
    "Metric Tons": 364
  },
  {
    Year: 2008,
    State: "MARYLAND",
    "Metric Tons": 113
  },
  {
    Year: 2008,
    State: "NEW JERSEY",
    "Metric Tons": 250
  },
  {
    Year: 2008,
    State: "VIRGINIA",
    "Metric Tons": 348
  },
  {
    Year: 2007,
    State: "MARYLAND",
    "Metric Tons": 144
  },
  {
    Year: 2007,
    State: "VIRGINIA",
    "Metric Tons": 843
  },
  {
    Year: 2006,
    State: "MARYLAND",
    "Metric Tons": 124
  },
  {
    Year: 2006,
    State: "NEW JERSEY",
    "Metric Tons": 156
  },
  {
    Year: 2006,
    State: "VIRGINIA",
    "Metric Tons": 0
  },
  {
    Year: 2005,
    State: "MARYLAND",
    "Metric Tons": 335
  },
  {
    Year: 2005,
    State: "NEW JERSEY",
    "Metric Tons": 73
  },
  {
    Year: 2004,
    State: "MARYLAND",
    "Metric Tons": 19
  },
  {
    Year: 2004,
    State: "NEW JERSEY",
    "Metric Tons": 147
  },
  {
    Year: 2004,
    State: "VIRGINIA",
    "Metric Tons": 20
  },
  {
    Year: 2003,
    State: "MARYLAND",
    "Metric Tons": 72
  },
  {
    Year: 2003,
    State: "NEW JERSEY",
    "Metric Tons": 324
  },
  {
    Year: 2003,
    State: "VIRGINIA",
    "Metric Tons": 35
  },
  {
    Year: 2002,
    State: "MARYLAND",
    "Metric Tons": 257
  },
  {
    Year: 2002,
    State: "NEW JERSEY",
    "Metric Tons": 172
  },
  {
    Year: 2002,
    State: "VIRGINIA",
    "Metric Tons": 44
  },
  {
    Year: 2001,
    State: "MARYLAND",
    "Metric Tons": 578
  },
  {
    Year: 2001,
    State: "NEW JERSEY",
    "Metric Tons": 187
  },
  {
    Year: 2001,
    State: "VIRGINIA",
    "Metric Tons": 95
  },
  {
    Year: 2e3,
    State: "MARYLAND",
    "Metric Tons": 1074
  },
  {
    Year: 2e3,
    State: "NEW JERSEY",
    "Metric Tons": 92
  },
  {
    Year: 2e3,
    State: "VIRGINIA",
    "Metric Tons": 74
  },
  {
    Year: 1999,
    State: "MARYLAND",
    "Metric Tons": 1107
  },
  {
    Year: 1999,
    State: "NEW JERSEY",
    "Metric Tons": 187
  },
  {
    Year: 1999,
    State: "VIRGINIA",
    "Metric Tons": 157
  },
  {
    Year: 1998,
    State: "MARYLAND",
    "Metric Tons": 1116
  },
  {
    Year: 1998,
    State: "NEW JERSEY",
    "Metric Tons": 319
  },
  {
    Year: 1998,
    State: "VIRGINIA",
    "Metric Tons": 101
  },
  {
    Year: 1997,
    State: "MARYLAND",
    "Metric Tons": 648
  },
  {
    Year: 1997,
    State: "NEW JERSEY",
    "Metric Tons": 269
  },
  {
    Year: 1997,
    State: "VIRGINIA",
    "Metric Tons": 138
  },
  {
    Year: 1996,
    State: "MARYLAND",
    "Metric Tons": 403
  },
  {
    Year: 1996,
    State: "NEW JERSEY",
    "Metric Tons": 156
  },
  {
    Year: 1996,
    State: "VIRGINIA",
    "Metric Tons": 72
  },
  {
    Year: 1995,
    State: "MARYLAND",
    "Metric Tons": 543
  },
  {
    Year: 1995,
    State: "NEW JERSEY",
    "Metric Tons": 71
  },
  {
    Year: 1995,
    State: "VIRGINIA",
    "Metric Tons": 181
  },
  {
    Year: 1994,
    State: "MARYLAND",
    "Metric Tons": 371
  },
  {
    Year: 1994,
    State: "VIRGINIA",
    "Metric Tons": 136
  },
  {
    Year: 1993,
    State: "MARYLAND",
    "Metric Tons": 75
  },
  {
    Year: 1993,
    State: "VIRGINIA",
    "Metric Tons": 185
  },
  {
    Year: 1992,
    State: "MARYLAND",
    "Metric Tons": 666
  },
  {
    Year: 1992,
    State: "NEW JERSEY",
    "Metric Tons": 15
  },
  {
    Year: 1992,
    State: "VIRGINIA",
    "Metric Tons": 329
  },
  {
    Year: 1991,
    State: "MARYLAND",
    "Metric Tons": 761
  },
  {
    Year: 1991,
    State: "NEW JERSEY",
    "Metric Tons": 95
  },
  {
    Year: 1991,
    State: "VIRGINIA",
    "Metric Tons": 773
  },
  {
    Year: 1990,
    State: "MARYLAND",
    "Metric Tons": 1307
  },
  {
    Year: 1990,
    State: "NEW JERSEY",
    "Metric Tons": 227
  },
  {
    Year: 1990,
    State: "VIRGINIA",
    "Metric Tons": 741
  },
  {
    Year: 1989,
    State: "MARYLAND",
    "Metric Tons": 1056
  },
  {
    Year: 1989,
    State: "VIRGINIA",
    "Metric Tons": 896
  },
  {
    Year: 1988,
    State: "MARYLAND",
    "Metric Tons": 1093
  },
  {
    Year: 1988,
    State: "VIRGINIA",
    "Metric Tons": 1328
  },
  {
    Year: 1987,
    State: "MARYLAND",
    "Metric Tons": 1734
  },
  {
    Year: 1987,
    State: "NEW JERSEY",
    "Metric Tons": 7
  },
  {
    Year: 1987,
    State: "VIRGINIA",
    "Metric Tons": 2189
  },
  {
    Year: 1986,
    State: "MARYLAND",
    "Metric Tons": 3611
  },
  {
    Year: 1986,
    State: "NEW JERSEY",
    "Metric Tons": 48
  },
  {
    Year: 1986,
    State: "VIRGINIA",
    "Metric Tons": 2622
  },
  {
    Year: 1985,
    State: "MARYLAND",
    "Metric Tons": 3900
  },
  {
    Year: 1985,
    State: "NEW JERSEY",
    "Metric Tons": 133
  },
  {
    Year: 1985,
    State: "VIRGINIA",
    "Metric Tons": 2052
  },
  {
    Year: 1984,
    State: "MARYLAND",
    "Metric Tons": 3648
  },
  {
    Year: 1984,
    State: "NEW JERSEY",
    "Metric Tons": 358
  },
  {
    Year: 1984,
    State: "VIRGINIA",
    "Metric Tons": 1960
  },
  {
    Year: 1983,
    State: "MARYLAND",
    "Metric Tons": 3377
  },
  {
    Year: 1983,
    State: "NEW JERSEY",
    "Metric Tons": 320
  },
  {
    Year: 1983,
    State: "VIRGINIA",
    "Metric Tons": 1902
  },
  {
    Year: 1982,
    State: "MARYLAND",
    "Metric Tons": 5568
  },
  {
    Year: 1982,
    State: "NEW JERSEY",
    "Metric Tons": 291
  },
  {
    Year: 1982,
    State: "VIRGINIA",
    "Metric Tons": 2381
  },
  {
    Year: 1981,
    State: "MARYLAND",
    "Metric Tons": 7131
  },
  {
    Year: 1981,
    State: "NEW JERSEY",
    "Metric Tons": 203
  },
  {
    Year: 1981,
    State: "VIRGINIA",
    "Metric Tons": 2669
  },
  {
    Year: 1980,
    State: "MARYLAND",
    "Metric Tons": 6779
  },
  {
    Year: 1980,
    State: "NEW JERSEY",
    "Metric Tons": 343
  },
  {
    Year: 1980,
    State: "VIRGINIA",
    "Metric Tons": 3559
  },
  {
    Year: 1979,
    State: "MARYLAND",
    "Metric Tons": 6119
  },
  {
    Year: 1979,
    State: "NEW JERSEY",
    "Metric Tons": 760
  },
  {
    Year: 1979,
    State: "VIRGINIA",
    "Metric Tons": 3718
  },
  {
    Year: 1978,
    State: "MARYLAND",
    "Metric Tons": 6520
  },
  {
    Year: 1978,
    State: "NEW JERSEY",
    "Metric Tons": 704
  },
  {
    Year: 1978,
    State: "VIRGINIA",
    "Metric Tons": 3668
  },
  {
    Year: 1977,
    State: "MARYLAND",
    "Metric Tons": 5910
  },
  {
    Year: 1977,
    State: "NEW JERSEY",
    "Metric Tons": 556
  },
  {
    Year: 1977,
    State: "VIRGINIA",
    "Metric Tons": 2261
  },
  {
    Year: 1976,
    State: "MARYLAND",
    "Metric Tons": 6750
  },
  {
    Year: 1976,
    State: "NEW JERSEY",
    "Metric Tons": 636
  },
  {
    Year: 1976,
    State: "VIRGINIA",
    "Metric Tons": 2760
  },
  {
    Year: 1975,
    State: "MARYLAND",
    "Metric Tons": 7440
  },
  {
    Year: 1975,
    State: "NEW JERSEY",
    "Metric Tons": 441
  },
  {
    Year: 1975,
    State: "VIRGINIA",
    "Metric Tons": 2829
  },
  {
    Year: 1974,
    State: "MARYLAND",
    "Metric Tons": 8294
  },
  {
    Year: 1974,
    State: "NEW JERSEY",
    "Metric Tons": 458
  },
  {
    Year: 1974,
    State: "VIRGINIA",
    "Metric Tons": 3056
  },
  {
    Year: 1973,
    State: "MARYLAND",
    "Metric Tons": 9263
  },
  {
    Year: 1973,
    State: "NEW JERSEY",
    "Metric Tons": 634
  },
  {
    Year: 1973,
    State: "VIRGINIA",
    "Metric Tons": 2259
  },
  {
    Year: 1972,
    State: "MARYLAND",
    "Metric Tons": 8642
  },
  {
    Year: 1972,
    State: "NEW JERSEY",
    "Metric Tons": 778
  },
  {
    Year: 1972,
    State: "VIRGINIA",
    "Metric Tons": 2275
  },
  {
    Year: 1971,
    State: "MARYLAND",
    "Metric Tons": 7764
  },
  {
    Year: 1971,
    State: "NEW JERSEY",
    "Metric Tons": 395
  },
  {
    Year: 1971,
    State: "VIRGINIA",
    "Metric Tons": 3829
  },
  {
    Year: 1970,
    State: "MARYLAND",
    "Metric Tons": 7541
  },
  {
    Year: 1970,
    State: "NEW JERSEY",
    "Metric Tons": 307
  },
  {
    Year: 1970,
    State: "VIRGINIA",
    "Metric Tons": 3648
  },
  {
    Year: 1969,
    State: "MARYLAND",
    "Metric Tons": 6677
  },
  {
    Year: 1969,
    State: "NEW JERSEY",
    "Metric Tons": 480
  },
  {
    Year: 1969,
    State: "VIRGINIA",
    "Metric Tons": 3373
  },
  {
    Year: 1968,
    State: "MARYLAND",
    "Metric Tons": 6747
  },
  {
    Year: 1968,
    State: "NEW JERSEY",
    "Metric Tons": 599
  },
  {
    Year: 1968,
    State: "VIRGINIA",
    "Metric Tons": 3540
  },
  {
    Year: 1967,
    State: "MARYLAND",
    "Metric Tons": 7589
  },
  {
    Year: 1967,
    State: "NEW JERSEY",
    "Metric Tons": 466
  },
  {
    Year: 1967,
    State: "VIRGINIA",
    "Metric Tons": 4113
  },
  {
    Year: 1966,
    State: "MARYLAND",
    "Metric Tons": 5347
  },
  {
    Year: 1966,
    State: "NEW JERSEY",
    "Metric Tons": 315
  },
  {
    Year: 1966,
    State: "VIRGINIA",
    "Metric Tons": 4283
  },
  {
    Year: 1965,
    State: "MARYLAND",
    "Metric Tons": 3910
  },
  {
    Year: 1965,
    State: "NEW JERSEY",
    "Metric Tons": 237
  },
  {
    Year: 1965,
    State: "VIRGINIA",
    "Metric Tons": 5701
  },
  {
    Year: 1964,
    State: "MARYLAND",
    "Metric Tons": 3605
  },
  {
    Year: 1964,
    State: "NEW JERSEY",
    "Metric Tons": 498
  },
  {
    Year: 1964,
    State: "VIRGINIA",
    "Metric Tons": 6418
  },
  {
    Year: 1963,
    State: "MARYLAND",
    "Metric Tons": 3518
  },
  {
    Year: 1963,
    State: "NEW JERSEY",
    "Metric Tons": 234
  },
  {
    Year: 1963,
    State: "VIRGINIA",
    "Metric Tons": 4771
  },
  {
    Year: 1962,
    State: "MARYLAND",
    "Metric Tons": 3691
  },
  {
    Year: 1962,
    State: "NEW JERSEY",
    "Metric Tons": 705
  },
  {
    Year: 1962,
    State: "VIRGINIA",
    "Metric Tons": 5352
  },
  {
    Year: 1961,
    State: "MARYLAND",
    "Metric Tons": 4689
  },
  {
    Year: 1961,
    State: "NEW JERSEY",
    "Metric Tons": 499
  },
  {
    Year: 1961,
    State: "VIRGINIA",
    "Metric Tons": 7785
  },
  {
    Year: 1960,
    State: "MARYLAND",
    "Metric Tons": 5339
  },
  {
    Year: 1960,
    State: "NEW JERSEY",
    "Metric Tons": 76
  },
  {
    Year: 1960,
    State: "VIRGINIA",
    "Metric Tons": 6958
  },
  {
    Year: 1959,
    State: "MARYLAND",
    "Metric Tons": 5428
  },
  {
    Year: 1959,
    State: "NEW JERSEY",
    "Metric Tons": 93
  },
  {
    Year: 1959,
    State: "VIRGINIA",
    "Metric Tons": 9687
  },
  {
    Year: 1958,
    State: "MARYLAND",
    "Metric Tons": 5455
  },
  {
    Year: 1958,
    State: "NEW JERSEY",
    "Metric Tons": 376
  },
  {
    Year: 1958,
    State: "VIRGINIA",
    "Metric Tons": 11568
  },
  {
    Year: 1957,
    State: "MARYLAND",
    "Metric Tons": 6683
  },
  {
    Year: 1957,
    State: "NEW JERSEY",
    "Metric Tons": 1234
  },
  {
    Year: 1957,
    State: "VIRGINIA",
    "Metric Tons": 9113
  },
  {
    Year: 1956,
    State: "MARYLAND",
    "Metric Tons": 7187
  },
  {
    Year: 1956,
    State: "NEW JERSEY",
    "Metric Tons": 2496
  },
  {
    Year: 1956,
    State: "VIRGINIA",
    "Metric Tons": 9625
  },
  {
    Year: 1955,
    State: "MARYLAND",
    "Metric Tons": 7834
  },
  {
    Year: 1955,
    State: "NEW JERSEY",
    "Metric Tons": 2361
  },
  {
    Year: 1955,
    State: "VIRGINIA",
    "Metric Tons": 9959
  },
  {
    Year: 1954,
    State: "MARYLAND",
    "Metric Tons": 9237
  },
  {
    Year: 1954,
    State: "NEW JERSEY",
    "Metric Tons": 3324
  },
  {
    Year: 1954,
    State: "VIRGINIA",
    "Metric Tons": 9627
  },
  {
    Year: 1953,
    State: "MARYLAND",
    "Metric Tons": 7908
  },
  {
    Year: 1953,
    State: "NEW JERSEY",
    "Metric Tons": 3849
  },
  {
    Year: 1953,
    State: "VIRGINIA",
    "Metric Tons": 8850
  },
  {
    Year: 1952,
    State: "MARYLAND",
    "Metric Tons": 7388
  },
  {
    Year: 1952,
    State: "NEW JERSEY",
    "Metric Tons": 3626
  },
  {
    Year: 1952,
    State: "VIRGINIA",
    "Metric Tons": 8224
  },
  {
    Year: 1951,
    State: "MARYLAND",
    "Metric Tons": 6587
  },
  {
    Year: 1951,
    State: "NEW JERSEY",
    "Metric Tons": 2613
  },
  {
    Year: 1951,
    State: "VIRGINIA",
    "Metric Tons": 6839
  },
  {
    Year: 1950,
    State: "MARYLAND",
    "Metric Tons": 6535
  },
  {
    Year: 1950,
    State: "NEW JERSEY",
    "Metric Tons": 3285
  },
  {
    Year: 1950,
    State: "VIRGINIA",
    "Metric Tons": 7052
  }
];
function _page($$payload, $$props) {
  push();
  const xKey = "Year";
  const yKey = "Metric Tons";
  const zKey = "State";
  data.forEach((d) => {
    d.Year = +d.Year;
    d[yKey] = +d[yKey];
  });
  const groupedData = [
    ...new Set(data.map((d) => d[zKey]))
  ].map((state) => ({
    State: state,
    values: data.filter((d) => d[zKey] === state).map((d) => ({ [xKey]: d[xKey], [yKey]: d[yKey] }))
  }));
  const marylandYears = data.filter((d) => d.State === "MARYLAND").map((d) => d.Year).sort((a, b) => a - b);
  const fiveYearTicks = marylandYears.filter((year) => year % 5 === 0);
  const seriesColors = ["#0077BE", "#D9D9D9", "#F4D35E"];
  const formatLabelX = (d) => d.toString();
  const formatLabelY = (d) => format(`~s`)(d);
  let currentStep = 0;
  const textSteps = [
    "In Maryland, the estimated population of native eastern oysters hit a historic low in 2004, dropping to just 19 tons. This figure represents only 0.21% of the historical peak since 1950, according to my analysis of National Oceanic and Atmospheric Administration(NOAA) Fisheries data.",
    "Maryland introduced the Oyster Restoration and Aquaculture Development Plan in 2010, which expanded oyster sanctuaries to help rebuild the Chesapeake Bays native oyster population.",
    "Under the new plan, as of 2022, the Maryland government designated and deployed an additional 844.24 square kilometers of oyster sanctuaries—a 369.09% increase compared to the area before 2010, based on my analysis of the sanctuaries map published by MDNR. (Scroll down to see the map.)"
  ];
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    $$payload2.out += `<link rel="preconnect" href="https://fonts.googleapis.com"> <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin=""> <link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,wght@0,400;1,400&amp;family=Zen+Antique+Soft&amp;display=swap" rel="stylesheet"> `;
    FrontLayout($$payload2, {
      frontImgUrl: "./_img/oyster_frontpage.jpg",
      title: "Maryland Is Bringing Back Oysters; Will Global Warming Ruin a Decade of Work?",
      description: "77 oyster restoration areas in the Chesapeake Bay are threatened by abnormal sea surface temperatures, according to my analysis."
    });
    $$payload2.out += `<!----> <div class="image-credit svelte-1ca93iu">Photograph by Mandy Henry, courtesy of Unsplash</div> <div class="page-container svelte-1ca93iu"><div class="metadata svelte-1ca93iu"><div class="credit-line svelte-1ca93iu"><strong>By <a href="https://jinpengli.com" class="link" target="_blank" rel="noopener noreferrer">Jinpeng Li</a></strong></div> <div class="publish-date svelte-1ca93iu">Jan 2025</div></div> <div class="text-section svelte-1ca93iu"><p>The first night I was in Baltimore for the National Institute for Computer-Assisted Reporting
			(NICAR), Krystal and I wandered into a local restaurant to try the crab cake and oysters.
			“Texas might have oysters from the Gulf of Mexico,” she said, “but East Coast oysters are
			meaty, sweet, and unlike anything you’ve ever tasted. Try them, and I promise you’ll never
			look at oysters the same way again.”</p> <p>People often associate oysters with the city’s upscale raw bars or elaborate seafood towers,
			but oysters were once abundant throughout the Chesapeake Bay. In the 1880s, the Bay supplied
			nearly half of the world’s annual oyster demand, with scholars comparing the harvesting frenzy
			to the California Gold Rush.</p> <p>Unfortunately, like the Gold Rush, this wealth was also fleeting. By the turn of the 20th
			century, natural oyster habitats had been greatly diminished thanks to overharvesting,
			pollution, and disease, and they have since continued to deplete. The native oyster population
			has dropped to a shocking 1% of its historical levels over the past decades in Maryland.</p> <p>But losing oysters translates to more than just the rising prices of a delicacy on the dinner
			table. It also signifies a loss of a natural filter that is critical to the health of our
			seawater. According to Marine conservationists, each adult oyster can filter up to 50 gallons
			of water a day, and an oyster bed can reduce the force of waves on wetlands, which protects
			coastlines from erosion.</p> <p>To counteract this decline, Maryland Department of Natural Resources (DNR) began building
			sanctuaries and seeding Chesapeake Bay with young oysters. Thanks to their efforts, the
			oysters are making a comeback.</p> <h2>Pushed Hard</h2> <p>MDNR has made two key efforts, one of which was expanding the restoration sanctuaries in 2010.</p> <p>Sanctuaries permanently close oyster beds to harvesting except in specific aquaculture lease
			sites, allowing oysters to grow undisturbed. The goal of this preservation is to build a
			strong breeding population of oysters that will build the reefs which provide crucial habitats
			for other bay species.</p></div> <div class="content-container svelte-1ca93iu"><div class="chart-container svelte-1ca93iu">`;
    LayerCake($$payload2, {
      x: "Year",
      y: "Metric Tons",
      z: "State",
      xDomain: [
        Math.min(...marylandYears),
        Math.max(...marylandYears)
      ],
      yDomain: [
        0,
        Math.max(...data.map((d) => d["Metric Tons"]))
      ],
      zScale: scaleOrdinal(),
      zRange: seriesColors,
      data: groupedData,
      padding: { top: 20, right: 30, bottom: 40, left: 50 },
      children: ($$payload3) => {
        Svg($$payload3, {
          children: invalid_default_snippet,
          $$slots: {
            default: ($$payload4, { xScale, height, xDomain }) => {
              if (currentStep >= 1) {
                $$payload4.out += "<!--[-->";
                $$payload4.out += `<rect${attr("x", xScale(2010))} y="0"${attr("width", xScale(xDomain[1]) - xScale(2010))}${attr("height", height)} fill="rgba(128, 128, 128, 0.2)"></rect><line${attr("x1", xScale(2010))} y1="0"${attr("x2", xScale(2010))}${attr("y2", height)} stroke="black" stroke-dasharray="5,5" stroke-width="2"></line>`;
              } else {
                $$payload4.out += "<!--[!-->";
              }
              $$payload4.out += `<!--]-->`;
              AxisX($$payload4, {
                gridlines: false,
                ticks: fiveYearTicks,
                format: formatLabelX,
                tickMarks: true
              });
              $$payload4.out += `<!---->`;
              AxisY($$payload4, {
                gridlines: true,
                ticks: 4,
                format: formatLabelY
              });
              $$payload4.out += `<!---->`;
              MultiLine($$payload4, {});
              $$payload4.out += `<!---->`;
            }
          }
        });
        $$payload3.out += `<!----> `;
        Html($$payload3, {
          children: ($$payload4) => {
            GroupLabels_html($$payload4);
          },
          $$slots: { default: true }
        });
        $$payload3.out += `<!---->`;
      },
      $$slots: { default: true }
    });
    $$payload2.out += `<!----></div> <div class="scrolly-container svelte-1ca93iu">`;
    Scrolly($$payload2, {
      get value() {
        return currentStep;
      },
      set value($$value) {
        currentStep = $$value;
        $$settled = false;
      },
      children: ($$payload3) => {
        const each_array = ensure_array_like(textSteps);
        $$payload3.out += `<!--[-->`;
        for (let i = 0, $$length = each_array.length; i < $$length; i++) {
          let text = each_array[i];
          $$payload3.out += `<div${attr("class", `step svelte-1ca93iu ${stringify([currentStep === i ? "active" : ""].filter(Boolean).join(" "))}`)}><div class="step-content svelte-1ca93iu"><p>${escape_html(text)}</p></div></div>`;
        }
        $$payload3.out += `<!--]-->`;
      },
      $$slots: { default: true }
    });
    $$payload2.out += `<!----></div></div> <div class="text-section svelte-1ca93iu"><p>In 2014, Maryland partnered with NOAA and other nonprofit organization to launch the <a href="https://www.chesapeakeprogress.com/abundant-life/oysters" target="_blank" rel="noopener noreferrer">Oyster Restoration Plan</a>. This initiative targeted 10 Chesapeake Bay tributaries and was committed to
			rebuilding oyster reefs by creating a substrate base and planting hatchery-produced juvenile
			oysters or seeding remnant reefs.</p> <p>Data from MDNR shows that Maryland's oyster planting efforts date back to 1953. Various
			methods are used to restore oyster beds, including planting oyster seeds and placing shells.</p></div> <div class="content-container svelte-1ca93iu"><div class="image-container svelte-1ca93iu"><img src="./_img/map-0.png" alt="Map step 1"${attr("class", `svelte-1ca93iu ${stringify([currentStep === 0 ? "active" : ""].filter(Boolean).join(" "))}`)}> <img src="./_img/map-1.png" alt="Map step 1"${attr("class", `svelte-1ca93iu ${stringify([currentStep === 1 ? "active" : ""].filter(Boolean).join(" "))}`)}> <img src="./_img/map-2.png" alt="Map step 2"${attr("class", `svelte-1ca93iu ${stringify([currentStep === 2 ? "active" : ""].filter(Boolean).join(" "))}`)}> <img src="./_img/map-3.png" alt="Map step 3"${attr("class", `svelte-1ca93iu ${stringify([currentStep === 3 ? "active" : ""].filter(Boolean).join(" "))}`)}></div> <div class="scrolly-container svelte-1ca93iu">`;
    Scrolly($$payload2, {
      get value() {
        return currentStep;
      },
      set value($$value) {
        currentStep = $$value;
        $$settled = false;
      },
      children: ($$payload3) => {
        const each_array_1 = ensure_array_like([
          ["This is the Chesapeake Bay."],
          [
            'The first method typically includes the addition of oyster seed, such as <span style="background-color: #db4c81;">hatchery seed</span> or <span style="background-color: #db4c81;">wild seed planting</span> to increase the likelihood of restoration success.',
            'The second effort involves using substrate materials to build oyster reefs in the bay, ideally through <span style="background-color: #897bd3;">fresh shell planting</span>. Oyster crews and aquaculturists <a href="https://www.oysterrecovery.org/get-involved/shell-recycling" target="_blank" rel="noopener noreferrer">recycle oyster shells from business</a>, but there aren’t enough to meet the state’s projected restoration needs. As a result, <span style="background-color: #897bd3;">dredged shells</span>, <span style="background-color: #897bd3;">mixed shells</span>, or <span style="background-color: #897bd3;">alternative materials</span> such as stones, concrete, porcelain, or steel slag are commonly used instead.'
          ],
          [
            '<span style="font-size: 11px;line-height: 0.5;">If the map for the second box is not activating, try scrolling down and then back up. You should see the map with only the pink and purple planting areas. Debugging...</span>',
            'Before 2010, Maryland primarily relied on wild seed planting, dredged shell addition, and limited fresh shell planting to repair oyster beds. However, since 2010, <span style="background-color: #f5deb3; font-weight: bold;">hatchery seed</span> has become the dominant method.',
            'Once abundant throughout Chesapeake Bay, oysters historically covered a total area of 215350 acres. New restoration areas overlap with <span style="background-color: #f5deb3; font-weight: bold;">72.76%</span> of <span style="background-color: #DBE1DF; font-weight: bold;">historic oyster beds</span>.'
          ],
          [
            'By 2010, 43% of the historic oyster bed area was legally protected and designated for <span style="background-color: #8ED7F3; font-weight: bold;">restoration</span>, increasing to <span style="background-color: #f5deb3; font-weight: bold;">46%</span> by 2022.'
          ]
        ]);
        $$payload3.out += `<!--[-->`;
        for (let i = 0, $$length = each_array_1.length; i < $$length; i++) {
          let stepText = each_array_1[i];
          const each_array_2 = ensure_array_like(stepText);
          $$payload3.out += `<div${attr("class", `step svelte-1ca93iu ${stringify([currentStep === i ? "active" : ""].filter(Boolean).join(" "))}`)}><div class="step-content svelte-1ca93iu"><!--[-->`;
          for (let $$index_1 = 0, $$length2 = each_array_2.length; $$index_1 < $$length2; $$index_1++) {
            let paragraph = each_array_2[$$index_1];
            $$payload3.out += `<p>${html(paragraph)}</p>`;
          }
          $$payload3.out += `<!--]--></div></div>`;
        }
        $$payload3.out += `<!--]-->`;
      },
      $$slots: { default: true }
    });
    $$payload2.out += `<!----></div></div> <div class="text-section svelte-1ca93iu"><p>“We’re making significant progress,” the NOAA announced in <a href="https://www.fisheries.noaa.gov/chesapeake-bay/oyster-reef-restoration-chesapeake-bay-were-making-significant-progress#progress-in-maryland" target="_blank" rel="noopener noreferrer">a press release on their website</a> .
			“Through the end of 2023, our team has planted 6.85 billion oyster seeds in Maryland as part
			of the effort.”</p> <p>In the 2022-23 season, Maryland watermen harvested about <a href="https://dnr.maryland.gov/fisheries/Documents/OysterHistoricHarvest.pdf" target="_blank" rel="noopener noreferrer">720,000</a> bushels of oysters from
			public fishing areas — the largest-recorded harvest since the late '80s. It marks the <a href="https://www.chesapeakebaymagazine.com/md-oyster-harvest-reaches-35-year-high/" target="_blank" rel="noopener noreferrer">second</a> record-high year for a wild harvest in Maryland.</p> <h2>Is Rising Sea Temperature a New Threat?</h2> <p>With native oyster populations nearly depleted, aquaculture has become a vital source for
			hatching more oysters to support the industry.</p> <p>Winter is a critical season for those oyster hatcheries. During this time, adult shellfish are
			placed in warm, algae-rich water to induce spawning. Hatcheries collect the eggs, then hatch
			and grow the oysters, which are then sold to farmers for further cultivation.</p></div> <div class="text-section svelte-1ca93iu"><p>But warmer winters are not favorable for wild oysters. The slowly increasing temperatures are creating new challenges for restoration efforts in nature.</p> <img src="./_img/warm.png" alt="Chesapeake Bay temperature map"> <p>The Chesapeake Bay in particular is experiencing a worrisome trend in rising temperatures. In 2023, the average sea surface temperature increased by 1.09°C in summer and 0.43°C in winter compared to the 2007–2022 average. While fluctuations of up to 2°C are within the normal range, these numbers only represent the average.</p> <p>When comparing restoration areas with sea surface anomalies, <span style="background-color: #f5deb3; font-weight: bold;">my analysis of NOAA satellite data found that 71 sanctuary areas experienced abnormal winter temperatures exceeding 2°C.</span> Most of these sites cluster near Southern Maryland—as if they’ve got front-row seats to the quirks of Maryland's warming waters.</p> <p>Rising sea temperatures disrupt oysters' natural cycles, potentially causing premature or delayed spawning and reducing their reproductive success.</p> <p>(To Be Continued...)</p></div></div>`;
  }
  do {
    $$settled = true;
    $$inner_payload = copy_payload($$payload);
    $$render_inner($$inner_payload);
  } while (!$$settled);
  assign_payload($$payload, $$inner_payload);
  pop();
}
export {
  _page as default
};
