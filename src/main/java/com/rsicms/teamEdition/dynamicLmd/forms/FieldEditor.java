package com.rsicms.teamEdition.dynamicLmd.forms;

import java.util.ArrayList;
import java.util.List;

import org.w3c.dom.Document;
import org.w3c.dom.Element;

import com.reallysi.rsuite.api.DataTypeOptionValue;
import com.reallysi.rsuite.api.ManagedObject;
import com.reallysi.rsuite.api.forms.FormColumnInstance;
import com.rsicms.pluginUtilities.SimpleFormHandler;
import com.rsicms.pluginUtilities.XmlUtility;
import static com.rsicms.pluginUtilities.FormBuilder.*;


public class FieldEditor extends SimpleFormHandler {
	protected XmlUtility xml;
	protected Document doc;
	protected ManagedObject mo;
	@Override
	public void adjustFormInstance() throws Throwable {
		mo = context.getArgs().getFirstManagedObject(context.getUser());
		xml = new XmlUtility(context);
		List<FormColumnInstance> cols = form.getColumns();
		for (Element field : xml.getElements(mo.getElement().getOwnerDocument(), "./lmd-field")) {
			FormColumnInstance col = column(field.getAttribute("name"),
				input(
						"name", 
						"Name", 
						null, 
						null, 
						field.getAttribute("name"), 
						true, 
						"[_A-Za-z\\-][_A-Za-z0-9\\-]*", 
						"Please enter an identifier name", 
						false
				),
				input(
						"label",
						"Label",
						null,
						null,
						field.getAttribute("label"),
						true,
						null,
						null,
						false
				),
				input(
						"description",
						"Description",
						null,
						null,
						field.getAttribute("description"),
						false,
						null,
						null,
						false
				)
			);
			List<DataTypeOptionValue> fieldFlags = new ArrayList<DataTypeOptionValue>();
			fieldFlags.add(new DataTypeOptionValue("versioned", "Versioned"));
			fieldFlags.add(new DataTypeOptionValue("contextual", "Allows contextual"));
			fieldFlags.add(new DataTypeOptionValue("allow-multiple", "Allows multiple"));
			List<String> setFlags = new ArrayList<String>(); 
			if (Boolean.valueOf(field.getAttribute("versioned"))) {
				setFlags.add("versioned");
			}
			if (Boolean.valueOf(field.getAttribute("contextual"))) {
				setFlags.add("contextual");
			}
			if (Boolean.valueOf(field.getAttribute("allow-multiple"))) {
				setFlags.add("allow-multiple");
			}
			col.addParam(checkbox("flags", null, null, fieldFlags, setFlags.toArray(new String[0]), null, false, true, false));
		}
	}

}
