package com.ReduxToolkit;

import android.Manifest;
import android.app.Activity;
import android.content.ContentProviderOperation;
import android.content.OperationApplicationException;
import android.content.pm.PackageManager;
import android.os.Bundle;
import android.os.RemoteException;
import android.provider.ContactsContract;
import android.view.View;
import android.widget.EditText;
import android.widget.Toast;
import androidx.core.app.ActivityCompat;
import java.util.ArrayList;

public class CustomModuleContact extends Activity {

    private EditText editTextName, editTextNumber;

    @Override
    protected void onCreate(Bundle savedInstState) {
        super.onCreate((savedInstState));
        setContentView((R.layout.custom_module_contact));

        ActivityCompat.requestPermissions(this,
                new String[] { Manifest.permission.WRITE_CONTACTS },
                PackageManager.PERMISSION_GRANTED);

        editTextName = findViewById(R.id.editText);
        editTextNumber = findViewById(R.id.editTextNumber);

    }

    public void buttonUpdateContact(View view) {

        ArrayList<ContentProviderOperation> contentProviderOperations = new ArrayList<ContentProviderOperation>();
        contentProviderOperations.add(ContentProviderOperation
                .newUpdate(ContactsContract.Data.CONTENT_URI)
                .withSelection(ContactsContract.Data.DISPLAY_NAME + " = ? AND " +
                        ContactsContract.Data.MIMETYPE + " = ?",
                        new String[] { editTextName.getText().toString(),
                                ContactsContract.CommonDataKinds.Phone.CONTENT_ITEM_TYPE })
                .withValue(ContactsContract.CommonDataKinds.Phone.NUMBER,
                        editTextNumber.getText().toString())
                .withValue(ContactsContract.CommonDataKinds.Phone.TYPE,
                        ContactsContract.CommonDataKinds.Phone.TYPE_MOBILE)
                .build());

        try {
            getContentResolver().applyBatch(ContactsContract.AUTHORITY, contentProviderOperations);
            Toast.makeText(this, "CONTACT UPDATED SUCCESSFULLY", Toast.LENGTH_LONG).show();
        } catch (OperationApplicationException e) {
            e.printStackTrace();
        } catch (RemoteException e) {
            e.printStackTrace();
        }
    }

}
