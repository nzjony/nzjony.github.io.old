function reverse(txt)
{
	var new_txt = "";
	var i;
	for (i = txt.length - 1; i >= 0; --i)
	{
		new_txt += txt.charAt(i);
	}

	return new_txt;
}

function hex2Int(charCode)
{
	if (charCode >= 97)
	{
		charCode -= 32;
	}

	var first = Math.floor(charCode / 16) - 3;
	var second = charCode % 16;
	var result = first * 10 + second;
	if (result > 9)
	{
		--result;
	}

	return result;
}

function hex2Ascii(pHigh, pLow)
{
	var high = hex2Int(pHigh) * 16;
	var low  = hex2Int(pLow);
	return high + low;
}

function xorEncode(txt, pass)
{
    var ord = [];
    var buf = "";

    for (var z = 1; z <= 255; z++)
    {
    	ord[String.fromCharCode(z)] = z;
    }

    for (var i = 0; i < txt.length; ++i)
    {
    	var charKey = "t"; // 116
    	var codeKey = (charKey.charCodeAt(0) + i * i) % 255;
		var test = String.fromCharCode(codeKey);
        buf += String.fromCharCode(ord[txt.substr(i, 1)] ^ ord[test]);
    }

    return buf;
}

function hexStringToAsciiString(hexText)
{
	var asciiText = "";
	var charCode = 0;
	for (var i = 0; i < hexText.length; ++i)
	{
		if (i % 2 != 0)
		{
			asciiText += String.fromCharCode(hex2Ascii(charCode, hexText.charCodeAt(i)));
		}
		else
		{
			charCode = hexText.charCodeAt(i);
		}
	}

	return asciiText;
}

function decode(hexText)
{
	// 1. hex to ascii string
	var asciiText = hexStringToAsciiString(hexText);
	//alert(asciiText);

	// 2. xor
	var xorText = xorEncode(asciiText, "t");
	//alert(xorText);

	// 3. ro13
	var buf = "";
	for (i = 0; i < xorText.length; ++i)
	{
		var code = xorText.charCodeAt(i);

		if (code == 46)
		{
			buf += String.fromCharCode(code + 18);
		}

		if (code == 63)
		{
			buf += String.fromCharCode(code - 17);
			continue;
		}

		if (code == 44)
		{
			buf += String.fromCharCode(code + 1);
			continue;
		}

		buf += String.fromCharCode(code + 13);
	}

	// 4. reverse
	//alert(buf);
	var reversedText = reverse(buf);
	//alert(reversedText);

	// 5. handle strange behavior
	var returnText = reversedText.substring(2, reversedText.length).replace(';', '');
	//alert(returnText);

	return returnText;
}


function sendmail()
{
	var decodedAddress = decode("14172E42DBD1CCC5EEEB8FB3627C5834280D0A");
	location.href = 'mailto:' + decodedAddress;
}

function buildHtml()
{
	var htmlText = '<div>';
	htmlText += '<p>Email: <a href="javascript:sendmail()">';
	htmlText += decode("14172E42DBD1CCC5EEEB8FB3627C5834280D0A");
	htmlText += '</a></p>';
	htmlText += '</div>';

	return htmlText;
}

// var tempElement = document.createElement('div');
// tempElement.innerHTML = buildHtml();
// document.getElementById('contact').appendChild(tempElement.firstChild);
