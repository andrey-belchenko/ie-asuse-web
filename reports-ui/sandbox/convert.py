import xml.etree.ElementTree as ET
import json


def xml_to_dict(element):
    item = {}
    item["type"] = element.tag
    item.update(element.attrib)
    items = list(map(xml_to_dict, element))
    if items:
        item["items"] = items
    return item


def clean_data(data, attributes):
    if isinstance(data, list):
        return [clean_data(item, attributes) for item in data]
    elif isinstance(data, dict):
        return {
            key: clean_data(value, attributes)
            for key, value in data.items()
            if key in attributes
        }
    else:
        return data


def xml_to_json(xml_file, json_file):
    tree = ET.parse(xml_file)
    root = tree.getroot()
    data = xml_to_dict(root)
    data = clean_data(data, ["type", "name", "title", "report", "items"])
    with open(json_file, "w", encoding="UTF-8") as f:
        json.dump(data, f, indent=4, ensure_ascii=False)


xml_to_json(
    r"C:\Repos\mygithub\ie-asuse-web-staff\front\more-vue\sandbox\1.xml",
    r"C:\Repos\mygithub\ie-asuse-web-staff\front\more-vue\sandbox\output.json",
)
