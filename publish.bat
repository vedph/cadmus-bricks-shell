@echo off
echo NPM PUBLISH
echo Before continuing, ensure that:
echo - you are logged in (npm whoami)
echo - you have successfully rebuilt all the libraries (npm run...)
pause

cd .\dist\myrmidon\cadmus-prosopa-person-name
call npm publish --access=public
cd ..\..\..
pause

cd .\dist\myrmidon\cadmus-prosopa-cited-person
call npm publish --access=public
cd ..\..\..
pause

cd .\dist\myrmidon\cadmus-refs-doc-references
call npm publish --access=public
cd ..\..\..
pause

cd .\dist\myrmidon\cadmus-refs-decorated-ids
call npm publish --access=public
cd ..\..\..
pause

cd .\dist\myrmidon\cadmus-refs-external-ids
call npm publish --access=public
cd ..\..\..
pause

echo ALL DONE
