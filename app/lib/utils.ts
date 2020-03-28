export const stripext = (filename) => {
    if (!filename) return filename;
    let p = filename.lastIndexOf('.');
    return (p < 0)? filename: filename.substring(0, p);
};

//=========================== DATE/TIME =================================//
export const nextDay = (dt) => {
	dt = new Date(dt);
	dt.setDate(dt.getDate() + 1);
	return dt;
}

export const dtAddSeconds = (dt, sec) => {
	dt = new Date(dt);
	dt.setSeconds(dt.getSeconds() + sec);
	return dt;
}

export function str2dt(datestr, timestr, tz)
{
	if(!timestr) timestr = "00:00:00";
    return new Date(`${datestr}T${timestr}.000${tz}`);
}

export const dt2ISO8601String = function(dt) {
	const tzo = -dt.getTimezoneOffset();
	const dif = tzo >= 0 ? '+' : '-';
	const pad = (num) => Math.floor(Math.abs(num)).toString().padStart(2, '0');
	const pad3 = (num) => Math.floor(Math.abs(num)).toString().padStart(3, '0');
	return dt.getFullYear() +
		'-' + pad(dt.getMonth() + 1) +
		'-' + pad(dt.getDate()) +
		'T' + pad(dt.getHours()) +
		':' + pad(dt.getMinutes()) +
		':' + pad(dt.getSeconds()) +
		'.' + pad3(dt.getMilliseconds()) +
		dif + pad(tzo / 60) +
		':' + pad(tzo % 60);
}
export const dt2datestr = (dt) => {
	const yy = dt.getFullYear();
	const mm = dt.getMonth() + 1; // getMonth() is zero-based
    const dd = dt.getDate();
    return [yy,
            (mm>9 ? '' : '0') + mm,
            (dd>9 ? '' : '0') + dd
           ].join('-');
};

export const dt2timestr = (dt) => {
    const hh = dt.getHours();
    const mm = dt.getMinutes();
    const ss = dt.getSeconds();
    return [(hh>9 ? '' : '0') + hh,
            (mm>9 ? '' : '0') + mm,
            (ss>9 ? '' : '0') + ss
           ].join(':');
};

export const sec2minNumber = (sec) => {
	const mm = Math.floor(sec / 60);
	const ss = sec % 60;
	if(!ss)
	    return mm;
	return  `${mm}.${ss > 9 ? '' : '0'}${ss}`;
}
// @n: Minute Number: a number which the left part of decimal point is as Minute,
//     and the right part literally is as Second. For example, 1.37 = 1:37 = 1m37s.
export const minNumber2sec = (n) => {
	const [mm, ss] = n.split('.');
	return 60 * Number(mm) + (ss? Number(ss): 0);
}

export const strToMinutes = function(str)
{
    const tokens = (str.indexOf(':') >= 0)?
        str.split(':'):
        str.split('：');
    
    const [h, m] = tokens;
    return  Number(h) * 60 + Number(m);
}

export const checkMinNumber = (n)=>{
	if(!n || isNaN(n))   // empty string OR not number
		return false;
	const [hh, ss] = n.toString().split('.');
	return !ss || (ss.length === 2 && Number(ss) < 60 && Number(ss) >= 0);
};

export const normalizeTimestr = (str) => {
	const pad = (v) =>  v? v.padStart(2, '0'): "00";

	if(!str) return "00:00:00";

	const [hh, mm, ss] = str.split(':');
	return [pad(hh),
	        pad(mm),
	        pad(ss)
		].join(':');
}

export const timestr2sec = (str) =>
{
    const sp = (str.indexOf(':') >= 0)? ':': '：';
	const [hh, mm, ss] = str.split(sp);
	return Number(hh) * 3600 + Number(mm) * 60 + Number(ss);
}

export const sec2timestr = (sec)=>{
	const hh = Math.floor(sec / 3600);
	sec -= 3600 * hh;
	const mm = Math.floor(sec / 60);
	sec -= 60 * mm;
	return [(hh>9 ? '' : '0') + hh,
			(mm>9 ? '' : '0') + mm,
			(sec>9 ? '' : '0') + sec,
		].join(':');
};

export const sec2hhmmstr = (sec, showSign=false)=>{
    const positive = sec >= 0;
    if(!positive) sec = -sec;

    let str = sec2timestr(sec + 30);    // plus 30 to round to minute
    str = str.substring(0, str.lastIndexOf(':'));  //trim sec part
    return positive? showSign?
                '+' + str: str:
                '-' + str;
}


// Array-like Utils ==============================
const paring = (arr) => {
    const result = [];
    for(let i = 0; i < arr.length; i+=2){
        result.push([arr[i], arr[i+1]]);
    }
    return result;
};

export const first = (obj) => {
	return (obj && obj.length > 0)? obj[0]: undefined;
}
export const last = (obj) => {
	return (obj && obj.length > 0)? obj[obj.length -1]: undefined;
}

export const toArray = (obj) => {
    const array = [];
    // iterate backwards ensuring that length is an UInt32
    for (let i = obj.length >>> 0; i--;) {
        array[i] = obj[i];
    }
    return array;
}

export function cmpArray(a1, a2, cmpfn){
    function valid(a){
        if(!Array.isArray(a)){
            console.error("cmpArray error: not array: ", a);
            return false;
        }
        return true;
    }

    if(!valid(a1)) return valid(a2)? -1: 0;
    if(!valid(a2)) return 1;

    let cmp = a1.length - a2.length;
    if(cmp !== 0)
        return cmp;

    for(let i = 0; i < a1.length; ++i){
        if((cmp = cmpfn(a1[i], a2[i])) !== 0)
            return cmp;
    }
    return cmp;  //assert(cmp === 0);
}

export function cmpString(s1, s2)
{
    if(!s1) return s2? -1: 0;
    if(!s2) return 1;
    return s1.localeCompare(s2);
}

export function partition(array, cond_fn) {
  const [pos, neg] = [[], []];
  array.forEach(elem => {
    cond_fn(elem)? pos.push(elem): neg.push(elem);
  });
  return [pos, neg];
}
