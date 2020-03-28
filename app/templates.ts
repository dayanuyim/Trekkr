import * as Handlebars from 'handlebars/dist/handlebars';
import './lib/handlebars-utils';

import {toLonLat} from 'ol/proj';
import {format} from 'ol/coordinate';

Handlebars.registerHelper('gmap', function(coordinate) {
    return format(toLonLat(coordinate), 'https://www.google.com.tw/maps/@{y},{x},15z?hl=zh-TW', 7);
});

Handlebars.registerHelper('fmtEle', function(ele) {
    return ele.toFixed(1);
});

Handlebars.registerHelper('fmtTime', function(moment) {
    return moment? moment.format('YYYY-MM-DD HH:mm:ss'): '-';
});

Handlebars.registerHelper("selop", (value, selected, text, attrs, options)=>{
    if(value === selected)
        attrs += " selected";
    return new Handlebars.SafeString(`<option value="${value}" ${attrs}>${text}</option>`);
});

export const ptPopup = Handlebars.compile(`
    <div class="pt-name">{{name}}</div>
    <div class="pt-coord" data-pt-coord="{{coordinate}}">
        <select class="pt-coord-title" dir="rtl">
            {{selop ""      coordsys "?"  "disabled hidden"}}
            {{selop "twd67" coordsys "TWD67"}}
            {{selop "twd97" coordsys "TWD97"}}
            {{selop "wgs84" coordsys "WGS84"}}
        </select>
        <span class="pt-coord-value">N/A</span>
        <a class="pt-gmap" href="{{gmap coordinate}}" target="_blank">
            <img src="./images/googleg.png" alt="Google G">
        </a>
    </div>

    <div class="pt-ele">
        <span class="pt-ele-title">ELE.</span>
        <span class="pt-ele-value">{{fmtEle ele.value}} m{{#if ele.est}} (est.){{/if}}</span>
    </div>

    <div class="pt-time">
        <span class="pt-time-title">TIME</span>
        <span class="pt-time-value">{{fmtTime time}}</span>
    </div>

    <footer class="sym-copyright">&copy; The icon made by
        <a class="sym-maker" href="{{symbol/maker/url}}" target="_blank">{{symbol/maker/title}}</a> from
        <a class="sym-provider" href="{{symbol/provider/url}}" target="_blank">{{symbol/provider/title}}</a> is licensed by
        <a class="sym-license" href="{{symbol/license/url}}" target="_blank">{{symbol/license/title}}</a>
    </footer>

`);

Handlebars.registerHelper("ptPopup", (data, options)=>{
    data = Object.assign({
        name: '',
        coordsys: '',
        coordinate: [0, 0],
        time: undefined,
        ele: {
            value: 0,
            est: false,
        },
        symbol: {
            maker: { title: '', url: '' },
            provider: { title: '', url: '' },
            license: { title: '', url: '' },
        }
    }, data);
    return new Handlebars.SafeString(ptPopup(data));
});

Handlebars.registerHelper("layer", (layer, options) => {
    const {id, type, url, desc, checked, opacity} = layer;
    return new Handlebars.SafeString(`
        <li data-layer-id="${id}" data-layer-type=${type} data-layer-url=${url}><input type="checkbox" ${checked? 'checked': ''}>${desc}</li>
`)});

export const settings = Handlebars.compile(`
    <div class="settings-ctrl">
        <button class="btn-toggle ol-button"><i class="fa fa-cog"></i></button>
    </div>
    <div class="settings-main">
        <div class="layer-grp">
            <ul class="layer-legend">
                {{#each layers}}
                    {{#if legend}}
                        {{layer this}}
                    {{/if}}
                {{/each}}
            </ul>
            <ul class="layer-base">
                {{#each layers}}
                    {{#unless legend}}
                        {{layer this}}
                    {{/unless}}
                {{/each}}
            </ul>
        </div>
    </div>
`);

export const main = Handlebars.compile(`
    <div id="pt-popup" class="ol-popup">
        <a href="#" class="ol-popup-closer"></a>
        <div class="ol-popup-content">
            {{ptPopup}}
        </div>
    </div>

    <div class="settings collapsed"></div>

    <div id="map" class="ol-map-container"></div>

`);
