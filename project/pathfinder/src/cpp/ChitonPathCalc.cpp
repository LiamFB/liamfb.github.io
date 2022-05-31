#include "ChitonPathCalc.h"

#include <iostream>
#include <vector>
#include <set>
#include <climits>

#include <string>

#include <emscripten/bind.h>

ChitonPathCalc::ChitonPathCalc(/* args */)
{
}

ChitonPathCalc::~ChitonPathCalc()
{
}

void ChitonPathCalc::addRowToMap(const std::vector<int> row)
{
    board.push_back(row);
}

std::vector<Coordinates> ChitonPathCalc::calcPath()
{
    std::cout << "Calculating" << std::endl;
    // Setup board, with every elm estDistance from start set to invinity Y x X
    const int xSize = board[0].size();
    const int ySize = board.size();
    std::multiset<GraphElm> unVisted;
    // int boardSize = ySize * xSize;
    std::vector<std::vector<GraphElm>> boardElements(ySize, std::vector<GraphElm>(xSize));
    // GraphElm boardElements[ySize][xSize];
    // inti board
    for (int y = 0; y < ySize; y++)
    {
        for (int x = 0; x < xSize; x++)
        {
            boardElements[y][x].crd.x = x;
            boardElements[y][x].crd.y = y;
            boardElements[y][x].cost = board[y][x];
            boardElements[y][x].estDistance = INT_MAX;
            unVisted.insert(boardElements[y][x]);

            if (x > 0)
            {
                boardElements[y][x - 1].connectedElm.push_back(Coordinates{x, y});
                boardElements[y][x].connectedElm.push_back(Coordinates{x - 1, y});
            }
            if (y > 0)
            {
                boardElements[y - 1][x].connectedElm.push_back(Coordinates{x, y});
                boardElements[y][x].connectedElm.push_back(Coordinates{x, y - 1});
            }
        }
    }
    return dijkstraAlgorithm(boardElements);
}

std::vector<Coordinates> ChitonPathCalc::dijkstraAlgorithm(std::vector<std::vector<GraphElm>> &boardElements)
{
    //===================================================
    std::vector<GraphElm *> seenButUnvisted;
    boardElements[0][0].estDistance = 0;
    bool done = false;
    GraphElm *currentElm;
    currentElm = &boardElements[0][0];
    GraphElm *nextElm;
    int counter = 0;
    // travers board
    int size = boardElements.size() * boardElements[0].size();
    bool noMoreItemsToSearch = false;
    while (counter < size && !noMoreItemsToSearch)
    {
        currentElm->visted = true;
        int currentLowDistance = INT_MAX;
        // 1. Update estimates using current nodes edges.
        for (Coordinates cElm : currentElm->connectedElm)
        {
            int newDistance = currentElm->estDistance + boardElements[cElm.y][cElm.x].cost;
            if (!boardElements[cElm.y][cElm.x].visted && newDistance < boardElements[cElm.y][cElm.x].estDistance)
            {
                boardElements[cElm.y][cElm.x].estDistance = newDistance;
                boardElements[cElm.y][cElm.x].prv = currentElm;
                // seenButUnvisted.push_back(boardElements[cElm.y][cElm.x]);
                addItemToUnvistedList(seenButUnvisted, boardElements[cElm.y][cElm.x]);
            }
        }
        if (seenButUnvisted.size() == 0)
        {
            noMoreItemsToSearch = true;
            break;
        }
        // 2 Choose next vertx
        nextElm = findLowestUnvistedButSeen(seenButUnvisted);
        boardElements[currentElm->crd.y][currentElm->crd.x] = *currentElm;
        currentElm = nextElm;
        counter++;
    };
    return findShortestPath(boardElements);
}

GraphElm *ChitonPathCalc::findLowestUnvistedButSeen(std::vector<GraphElm *> &seenButNotInvisted)
{
    int indexOfLowest = 0;
    for (int i = 0; i < seenButNotInvisted.size(); i++)
    {
        /* code */
        if (seenButNotInvisted[i]->estDistance < seenButNotInvisted[indexOfLowest]->estDistance)
        {
            indexOfLowest = i;
        }
    }
    GraphElm *lowest = seenButNotInvisted[indexOfLowest];

    // std::cout << "going to x: " << lowest->crd.x << " y: " << lowest->crd.y << std::endl;
    addMessage(std::to_string(lowest->crd.x) + ',' + std::to_string(lowest->crd.y));

    seenButNotInvisted.erase(seenButNotInvisted.begin() + indexOfLowest);
    return lowest;
}

void ChitonPathCalc::addItemToUnvistedList(std::vector<GraphElm *> &seenButNotInvisted, GraphElm &elm)
{
    // only add elment if it is not already in there
    bool found = false;
    for (int i = 0; i < seenButNotInvisted.size(); i++)
    {
        if (seenButNotInvisted[i]->crd.x == elm.crd.x && seenButNotInvisted[i]->crd.y == elm.crd.y)
        {
            found = true;
        }
    }
    if (!found)
    {
        seenButNotInvisted.push_back(&elm);
        // seenButNotInvisted.push_back(elm);
    }
}

std::vector<Coordinates> ChitonPathCalc::findShortestPath(std::vector<std::vector<GraphElm>> &boardElements)
{
    int xEnd = boardElements.size() - 1;
    int yEnd = boardElements[xEnd].size() - 1;

    std::vector<Coordinates> results;

    GraphElm endElm = boardElements[xEnd][yEnd];

    while (endElm.prv != nullptr)
    {
        results.push_back(endElm.crd);
        endElm = *endElm.prv;
    }
    results.push_back(endElm.crd);

    std::cout << "Result Length: " << results.size() << std::endl;
    return results;
}

std::string ChitonPathCalc::printSomething()
{
    return "Something";
}

int ChitonPathCalc::sumArray()
{
    int total = 0;
    for (std::vector<int> row : board)
    {
        for (int i : row)
        {
            total += i;
        }
    }
    return total;
}

std::string ChitonPathCalc::getMessage()
{
    if (msgQueue.empty())
    {
        return "";
    }
    std::string frontvalue = msgQueue.front();
    msgQueue.pop();
    return frontvalue;
}

void ChitonPathCalc::addMessage(std::string message)
{
    msgQueue.push(message);
}

// Binding code
EMSCRIPTEN_BINDINGS(my_class_example)
{
    emscripten::value_object<Coordinates>("Coordinates")
        .field("x", &Coordinates::x)
        .field("y", &Coordinates::y);

    emscripten::class_<ChitonPathCalc>("ChitonPathCalc")
        .constructor()
        .function("calcPath", &ChitonPathCalc::calcPath)
        .function("addRowToMap", &ChitonPathCalc::addRowToMap)
        .function("printSomething", &ChitonPathCalc::printSomething)
        .function("sumArray", &ChitonPathCalc::sumArray)
        .function("getMessage", &ChitonPathCalc::getMessage);

    emscripten::register_vector<int>("IntList");
    emscripten::register_vector<Coordinates>("vector<Coordinates>");
}

// std::vector<Coordinates>